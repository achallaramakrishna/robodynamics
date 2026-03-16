"use client";

import { useEffect, useState } from "react";

export type AvatarExpression =
  | "neutral"
  | "happy"
  | "thinking"
  | "encouraging"
  | "concerned"
  | "surprised";

export type AvatarVariant = "classic" | "screen" | "round";

const VISEME_HEIGHT: Record<string, number> = {
  rest: 0, m: 0, a: 1, e: 0.7, o: 0.85, u: 0.5, f: 0.3,
};
const VISEME_SEQ = ["rest", "a", "e", "rest", "o", "m", "a", "u", "rest", "e", "o", "rest"];

interface BotProps {
  speaking: boolean;
  expression: AvatarExpression;
  size: number;
  accentColor: string;
  baseColor: string;
  compact: boolean;
  blink: boolean;
  openRatio: number;
  bobPx: number;
}

export function RobotAvatar({
  speaking = false,
  expression = "neutral",
  size = 200,
  accentColor = "#E91E8C",
  baseColor = "#3B3A8C",
  compact = false,
  variant = "screen",
}: {
  speaking?: boolean;
  expression?: AvatarExpression;
  size?: number;
  accentColor?: string;
  baseColor?: string;
  compact?: boolean;
  variant?: AvatarVariant;
}) {
  const [blink, setBlink] = useState(false);
  const [visemeIdx, setVisemeIdx] = useState(0);
  const [bob, setBob] = useState(false);

  // Auto-blink every 3–7 s
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        schedule();
      }, 3000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  // Mouth animation ~110 ms per viseme
  useEffect(() => {
    if (!speaking) { setVisemeIdx(0); return; }
    const id = setInterval(() => setVisemeIdx(i => (i + 1) % VISEME_SEQ.length), 110);
    return () => clearInterval(id);
  }, [speaking]);

  // Head bob ~350 ms when speaking
  useEffect(() => {
    if (!speaking) { setBob(false); return; }
    const id = setInterval(() => setBob(b => !b), 350);
    return () => clearInterval(id);
  }, [speaking]);

  const openRatio = VISEME_HEIGHT[VISEME_SEQ[visemeIdx]] ?? 0;
  const bobPx = bob && speaking ? -3 : 0;
  const p: BotProps = { speaking, expression, size, accentColor, baseColor, compact, blink, openRatio, bobPx };

  if (variant === "round") return <RoundBot {...p} />;
  if (variant === "classic") return <ClassicBot {...p} />;
  return <ScreenBot {...p} />;
}

// ─────────────────────────────────────────────────────────────
// SCREEN BOT — LED display face (techy, modern, kid-friendly)
// Inspired by the popular "glowing screen face" robot style.
// ─────────────────────────────────────────────────────────────
function ScreenBot({ speaking, expression, size, accentColor, baseColor, compact, blink, openRatio, bobPx }: BotProps) {
  const glowId   = "rd-sc-glow";
  const ledGlow  = "rd-sc-led";
  const headGrad = "rd-sc-head";

  // LED eye height — collapses to 3 on blink
  const eyeH = blink ? 3
    : expression === "surprised"                              ? 28
    : expression === "happy" || expression === "encouraging" ? 12
    : expression === "thinking"                              ? 15
    : 22;

  // Brow row
  const browY    = expression === "surprised" ? 20 : expression === "happy" ? 31 : 26;
  const lBrowRot = expression === "thinking"  ? "rotate(-7,72,32)"  : expression === "concerned" ? "rotate(7,72,32)"  : "rotate(0)";
  const rBrowRot = expression === "thinking"  ? "rotate(7,128,32)"  : expression === "concerned" ? "rotate(-7,128,32)": "rotate(0)";

  // Mouth LED
  const mx = 68, mw = 64, myBase = 97;
  const mouthH = 6 + openRatio * 18;

  return (
    <div style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: `translateY(${bobPx}px)`, transition: "transform 0.18s ease", flexShrink: 0 }}>
      <svg viewBox="0 0 200 210" width={size} height={size} aria-hidden="true" style={{ overflow: "visible" }}>
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={accentColor} floodOpacity="0.5" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={ledGlow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feFlood floodColor={accentColor} floodOpacity="1" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id={headGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6562d4" />
            <stop offset="100%" stopColor={baseColor} />
          </linearGradient>
        </defs>

        {/* ── Speaking pulse ring ── */}
        {speaking && (
          <rect x="18" y="18" width="164" height="126" rx="34" fill="none" stroke={accentColor} strokeWidth="2.5">
            <animate attributeName="x"      values="18;8;18"       dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="width"  values="164;184;164"   dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="y"      values="18;12;18"      dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="height" values="126;138;126"   dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0;0.55"  dur="1.1s" repeatCount="indefinite" />
          </rect>
        )}

        {/* ── Antenna ── */}
        <line x1="100" y1="24" x2="100" y2="8" stroke={baseColor} strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="6" r="8" fill={accentColor} filter={`url(#${ledGlow})`}>
          {speaking && <animate attributeName="r"       values="8;12;8"     dur="0.9s" repeatCount="indefinite" />}
          {speaking && <animate attributeName="opacity" values="1;0.4;1"    dur="0.9s" repeatCount="indefinite" />}
        </circle>

        {/* ── Ear studs ── */}
        <rect x="13"  y="52" width="16" height="32" rx="8" fill={baseColor} />
        <circle cx="21"  cy="68" r="6" fill={accentColor} />
        <rect x="171" y="52" width="16" height="32" rx="8" fill={baseColor} />
        <circle cx="179" cy="68" r="6" fill={accentColor} />

        {/* ── Head body ── */}
        <rect x="28" y="22" width="144" height="122" rx="28"
          fill={`url(#${headGrad})`}
          filter={speaking ? `url(#${glowId})` : undefined}
        />

        {/* ── Floating brows (on forehead above screen) ── */}
        <rect x="57"  y={browY} width="30" height="5" rx="3" fill={accentColor} transform={lBrowRot} />
        <rect x="113" y={browY} width="30" height="5" rx="3" fill={accentColor} transform={rBrowRot} />

        {/* ── Dark screen face panel ── */}
        <rect x="44" y="40" width="112" height="84" rx="16" fill="#0e0c2a" />

        {/* ── LEFT LED eye ── */}
        <rect
          x="57" y={68 - eyeH / 2} width="38" height={eyeH}
          rx={Math.min(10, eyeH / 2 + 1)}
          fill={accentColor} filter={`url(#${ledGlow})`}
        />
        {eyeH > 10 && <circle cx="82" cy={68 - eyeH / 4} r="4" fill="white" opacity="0.7" />}

        {/* ── RIGHT LED eye ── */}
        <rect
          x="105" y={68 - eyeH / 2} width="38" height={eyeH}
          rx={Math.min(10, eyeH / 2 + 1)}
          fill={accentColor} filter={`url(#${ledGlow})`}
        />
        {eyeH > 10 && <circle cx="130" cy={68 - eyeH / 4} r="4" fill="white" opacity="0.7" />}

        {/* ── Mouth housing ── */}
        <rect x={mx - 8} y={myBase - 6} width={mw + 16} height={compact ? 26 : 30} rx="8" fill="#060418" />

        {/* ── LED mouth ── */}
        {openRatio > 0.1 ? (
          <rect
            x={mx} y={myBase - openRatio * 6} width={mw} height={mouthH}
            rx="5" fill={accentColor} filter={`url(#${ledGlow})`}
          />
        ) : expression === "happy" || expression === "encouraging" ? (
          <path
            d={`M ${mx + 4} ${myBase + 2} Q 100 ${myBase + 16} ${mx + mw - 4} ${myBase + 2}`}
            stroke={accentColor} strokeWidth="5" fill="none" strokeLinecap="round"
            filter={`url(#${ledGlow})`}
          />
        ) : expression === "concerned" ? (
          <path
            d={`M ${mx + 4} ${myBase + 14} Q 100 ${myBase + 4} ${mx + mw - 4} ${myBase + 14}`}
            stroke={accentColor} strokeWidth="5" fill="none" strokeLinecap="round"
          />
        ) : (
          // Neutral flat bar
          <rect x={mx + 6} y={myBase + 7} width={mw - 12} height="5" rx="3" fill={accentColor} opacity="0.75" />
        )}

        {/* ── Thinking dots ── */}
        {expression === "thinking" && (
          <>
            <circle cx="154" cy="58" r="5" fill={accentColor} opacity="0.9" />
            <circle cx="167" cy="46" r="4" fill={accentColor} opacity="0.6" />
            <circle cx="177" cy="36" r="3" fill={accentColor} opacity="0.3" />
          </>
        )}

        {/* ── Encouraging sparkles ── */}
        {expression === "encouraging" && (
          <>
            <text x="160" y="52" fontSize="18" fill={accentColor}>✦</text>
            <text x="18"  y="68" fontSize="14" fill={accentColor} opacity="0.8">✦</text>
          </>
        )}

        {/* ── Neck / collar ── */}
        <rect x="82" y="142" width="36" height="20" rx="6" fill={baseColor} />
        <rect x="82" y="152" width="36" height="6"  rx="3" fill={accentColor} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROUND BOT — Big Pixar-style eyes, very child-friendly
// Inspired by cute dome-bot designs (EVE / Baymax proportions)
// ─────────────────────────────────────────────────────────────
function RoundBot({ speaking, expression, size, accentColor, baseColor, compact, blink, openRatio, bobPx }: BotProps) {
  const glowId   = "rd-rb-glow";
  const headGrad = "rd-rb-head";

  const eyeRY = blink ? 2 : expression === "surprised" ? 26 : 22;
  const mouthY = compact ? 112 : 120;
  const browY    = expression === "surprised" ? 50 : expression === "happy" ? 60 : 56;
  const lBrowRot = expression === "thinking"  ? "rotate(-8,72,60)"  : expression === "concerned" ? "rotate(8,72,60)"   : "rotate(0)";
  const rBrowRot = expression === "thinking"  ? "rotate(8,128,60)"  : expression === "concerned" ? "rotate(-8,128,60)" : "rotate(0)";

  return (
    <div style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: `translateY(${bobPx}px)`, transition: "transform 0.18s ease", flexShrink: 0 }}>
      <svg viewBox="0 0 200 210" width={size} height={size} aria-hidden="true" style={{ overflow: "visible" }}>
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor={accentColor} floodOpacity="0.5" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id={headGrad} cx="38%" cy="30%" r="62%">
            <stop offset="0%" stopColor="#6562d4" />
            <stop offset="100%" stopColor={baseColor} />
          </radialGradient>
        </defs>

        {/* ── Speaking pulse ── */}
        {speaking && (
          <circle cx="100" cy="88" r="80" fill="none" stroke={accentColor} strokeWidth="2.5">
            <animate attributeName="r"       values="78;92;78"    dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0;0.55" dur="1s" repeatCount="indefinite" />
          </circle>
        )}

        {/* ── Ear bumps ── */}
        <circle cx="24"  cy="88" r="16" fill={baseColor} filter={speaking ? `url(#${glowId})` : undefined} />
        <circle cx="176" cy="88" r="16" fill={baseColor} />
        <circle cx="24"  cy="88" r="9"  fill={accentColor} />
        <circle cx="176" cy="88" r="9"  fill={accentColor} />

        {/* ── Head ── */}
        <circle cx="100" cy="88" r="72"
          fill={`url(#${headGrad})`}
          filter={speaking ? `url(#${glowId})` : undefined}
        />

        {/* ── Antenna nubs ── */}
        <circle cx="82"  cy="20" r="8" fill={baseColor} />
        <circle cx="118" cy="20" r="8" fill={baseColor} />
        <circle cx="82"  cy="20" r="5" fill={accentColor} />
        <circle cx="118" cy="20" r="5" fill={accentColor} />

        {/* ── Brows ── */}
        <rect x="53"  y={browY} width="30" height="5" rx="3" fill={accentColor} transform={lBrowRot} />
        <rect x="117" y={browY} width="30" height="5" rx="3" fill={accentColor} transform={rBrowRot} />

        {/* ── LEFT EYE ── */}
        <ellipse cx="72" cy="82" rx="22" ry={eyeRY} fill="white" />
        {!blink && (
          <>
            <circle cx="75" cy="85" r="15" fill={baseColor} />
            <circle cx="80" cy="80" r="5"  fill="white" />
            <circle cx="78" cy="86" r="7"  fill="#0a0a1a" />
          </>
        )}
        {/* Happy squint overlay */}
        {!blink && (expression === "happy" || expression === "encouraging") && (
          <path d="M 50 89 Q 72 104 94 89" stroke="#3d3a9e" strokeWidth="8" fill="none" />
        )}

        {/* ── RIGHT EYE ── */}
        <ellipse cx="128" cy="82" rx="22" ry={eyeRY} fill="white" />
        {!blink && (
          <>
            <circle cx="131" cy="85" r="15" fill={baseColor} />
            <circle cx="136" cy="80" r="5"  fill="white" />
            <circle cx="134" cy="86" r="7"  fill="#0a0a1a" />
          </>
        )}
        {!blink && (expression === "happy" || expression === "encouraging") && (
          <path d="M 106 89 Q 128 104 150 89" stroke="#3d3a9e" strokeWidth="8" fill="none" />
        )}

        {/* ── Cheek blush (happy / encouraging) ── */}
        {(expression === "happy" || expression === "encouraging") && (
          <>
            <ellipse cx="48"  cy="108" rx="15" ry="9" fill={accentColor} opacity="0.22" />
            <ellipse cx="152" cy="108" rx="15" ry="9" fill={accentColor} opacity="0.22" />
          </>
        )}

        {/* ── Mouth ── */}
        {openRatio > 0.12 ? (
          <ellipse cx="100" cy={mouthY + openRatio * 10} rx="26" ry={4 + openRatio * 14} fill={accentColor} />
        ) : expression === "happy" || expression === "encouraging" ? (
          <path d={`M 68 ${mouthY} Q 100 ${mouthY + 26} 132 ${mouthY}`}
            stroke={accentColor} strokeWidth="6" fill="none" strokeLinecap="round" />
        ) : expression === "concerned" ? (
          <path d={`M 68 ${mouthY + 16} Q 100 ${mouthY + 4} 132 ${mouthY + 16}`}
            stroke={accentColor} strokeWidth="6" fill="none" strokeLinecap="round" />
        ) : (
          <path d={`M 74 ${mouthY + 6} Q 100 ${mouthY + 18} 126 ${mouthY + 6}`}
            stroke={accentColor} strokeWidth="5" fill="none" strokeLinecap="round" />
        )}

        {/* ── Thinking dots ── */}
        {expression === "thinking" && (
          <>
            <circle cx="154" cy="54" r="5" fill={accentColor} opacity="0.9" />
            <circle cx="166" cy="42" r="4" fill={accentColor} opacity="0.6" />
            <circle cx="176" cy="32" r="3" fill={accentColor} opacity="0.3" />
          </>
        )}

        {/* ── Encouraging sparkles ── */}
        {expression === "encouraging" && (
          <>
            <text x="158" y="50" fontSize="18" fill={accentColor}>✦</text>
            <text x="18"  y="66" fontSize="14" fill={accentColor} opacity="0.8">✦</text>
          </>
        )}

        {/* ── Neck / collar ── */}
        <rect x="82" y="158" width="36" height="20" rx="6" fill={baseColor} />
        <rect x="82" y="168" width="36" height="6"  rx="3" fill={accentColor} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CLASSIC BOT — Original helmet design (refined)
// ─────────────────────────────────────────────────────────────
function ClassicBot({ speaking, expression, size, accentColor, baseColor, compact, blink, openRatio, bobPx }: BotProps) {
  const glowId = "rd-cl-glow";

  const mouthH = compact ? 6 + openRatio * 10 : 8 + openRatio * 16;
  const eyeRY  = expression === "happy" || expression === "encouraging" ? 9
    : expression === "surprised" ? 24 : 20;
  const browY     = expression === "thinking" ? 62 : expression === "surprised" ? 58 : expression === "happy" ? 70 : 66;
  const lBrowRot  = expression === "thinking"  ? "rotate(-6,73,68)" : expression === "concerned" ? "rotate(6,73,68)"   : "rotate(0,73,68)";
  const rBrowRot  = expression === "thinking"  ? "rotate(6,127,68)" : expression === "concerned" ? "rotate(-6,127,68)" : "rotate(0,127,68)";
  const mouthY    = compact ? 118 : 130;
  const mouthW    = compact ? 22  : 30;
  const jawY      = compact ? mouthY + 6 + openRatio * 6 : mouthY + 8 + openRatio * 10;

  return (
    <div style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: `translateY(${bobPx}px)`, transition: "transform 0.18s ease", flexShrink: 0 }}>
      <svg viewBox="0 0 200 210" width={size} height={size} aria-hidden="true" style={{ overflow: "visible" }}>
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={accentColor} floodOpacity="0.55" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Speaking pulse ring */}
        {speaking && (
          <ellipse cx="100" cy="98" rx="78" ry="83" fill="none" stroke={accentColor} strokeWidth="2.5">
            <animate attributeName="rx"      values="78;88;78"    dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="ry"      values="83;94;83"    dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5"   dur="1.1s" repeatCount="indefinite" />
          </ellipse>
        )}

        {/* Head / helmet */}
        <ellipse cx="100" cy="98" rx="72" ry="76" fill={baseColor} filter={speaking ? `url(#${glowId})` : undefined} />
        <ellipse cx="100" cy="103" rx="56" ry="60" fill="#4a47a3" />
        <path d="M 38 72 Q 100 20 162 72" stroke={accentColor} strokeWidth="11" fill="none" strokeLinecap="round" />
        <ellipse cx="28"  cy="100" rx="10" ry="15" fill={accentColor} />
        <ellipse cx="172" cy="100" rx="10" ry="15" fill={accentColor} />

        {/* Brows */}
        <rect x="55"  y={browY} width="34" height="5" rx="3" fill={accentColor} transform={lBrowRot} />
        <rect x="111" y={browY} width="34" height="5" rx="3" fill={accentColor} transform={rBrowRot} />

        {/* Left eye */}
        <ellipse cx="73"  cy="93" rx="19" ry={blink ? 2 : eyeRY} fill="white" />
        {!blink && (
          <>
            <circle cx="76" cy="96" r="11" fill="#12112e" />
            <circle cx="80" cy="91" r="4"  fill="white" />
            <circle cx="79" cy="97" r="5"  fill="#12112e" />
          </>
        )}

        {/* Right eye */}
        <ellipse cx="127" cy="93" rx="19" ry={blink ? 2 : eyeRY} fill="white" />
        {!blink && (
          <>
            <circle cx="130" cy="96" r="11" fill="#12112e" />
            <circle cx="134" cy="91" r="4"  fill="white" />
            <circle cx="133" cy="97" r="5"  fill="#12112e" />
          </>
        )}

        {/* Mouth housing */}
        <rect x={100 - mouthW - 10} y={mouthY - 2} width={(mouthW + 10) * 2} height={compact ? 28 : 38} rx="14" fill="#2a2866" />
        {openRatio > 0.25 && (
          <rect x={100 - mouthW + 4} y={mouthY + 2} width={(mouthW - 4) * 2} height={compact ? 9 : 12} rx="6" fill="white" />
        )}
        <ellipse cx="100" cy={jawY} rx={mouthW} ry={Math.max(3, mouthH / 2)} fill={accentColor} />

        {(expression === "happy" || expression === "encouraging") && openRatio < 0.2 && (
          <path d={`M ${100 - mouthW + 4} ${mouthY + 10} Q 100 ${mouthY + 26} ${100 + mouthW - 4} ${mouthY + 10}`}
            stroke={accentColor} strokeWidth="5" fill="none" strokeLinecap="round" />
        )}
        {expression === "concerned" && openRatio < 0.2 && (
          <path d={`M ${100 - mouthW + 4} ${mouthY + 22} Q 100 ${mouthY + 10} ${100 + mouthW - 4} ${mouthY + 22}`}
            stroke={accentColor} strokeWidth="5" fill="none" strokeLinecap="round" />
        )}

        {/* Neck */}
        <rect x="82" y="172" width="36" height="22" rx="6" fill={baseColor} />
        <rect x="82" y="182" width="36" height="6"  rx="3" fill={accentColor} />

        {/* Thinking dots */}
        {expression === "thinking" && (
          <>
            <circle cx="150" cy="60" r="5" fill={accentColor} opacity="0.9" />
            <circle cx="163" cy="48" r="4" fill={accentColor} opacity="0.6" />
            <circle cx="174" cy="38" r="3" fill={accentColor} opacity="0.3" />
          </>
        )}
        {expression === "encouraging" && (
          <>
            <text x="158" y="55" fontSize="18" fill={accentColor}>✦</text>
            <text x="22"  y="70" fontSize="14" fill={accentColor} opacity="0.7">✦</text>
          </>
        )}
      </svg>
    </div>
  );
}
