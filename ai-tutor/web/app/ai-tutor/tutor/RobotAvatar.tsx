"use client";

import { useEffect, useState } from "react";

export type AvatarExpression =
 | "neutral"
 | "happy"
 | "thinking"
 | "encouraging"
 | "concerned"
 | "surprised";

export type AvatarVariant = "classic" | "screen" | "round" | "teaching" | "nova";

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
 useEffect(() => {
  if (!speaking) { setVisemeIdx(0); return; }
  const id = setInterval(() => setVisemeIdx(i => (i + 1) % VISEME_SEQ.length), 110);
  return () => clearInterval(id);
 }, [speaking]);
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
 if (variant === "teaching") return <TeachingBot {...p} />;
 if (variant === "nova") return <NovaBot {...p} />;
 return <ScreenBot {...p} />;
}
function ScreenBot({ speaking, expression, size, accentColor, baseColor, compact, blink, openRatio, bobPx }: BotProps) {
 const glowId = "rd-sc-glow";
 const ledGlow = "rd-sc-led";
 const headGrad = "rd-sc-head";
 const auraGrad = "rd-sc-aura";
 const panelGrad = "rd-sc-panel";
 const chinGrad = "rd-sc-chin";

 const eyeH = blink ? 3
  : expression === "surprised" ? 28
  : expression === "happy" || expression === "encouraging" ? 12
  : expression === "thinking" ? 15
  : 22;

 const browY = expression === "surprised" ? 20 : expression === "happy" ? 31 : 26;
 const lBrowRot = expression === "thinking" ? "rotate(-7,72,32)" : expression === "concerned" ? "rotate(7,72,32)" : "rotate(0)";
 const rBrowRot = expression === "thinking" ? "rotate(7,128,32)" : expression === "concerned" ? "rotate(-7,128,32)" : "rotate(0)";

 const mx = 62;
 const mw = 76;
 const myBase = 98;
 const mouthH = 7 + openRatio * 19;
 const eyeY = 70;
 const pulseOpacity = speaking ? 1 : 0.78;

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
      <stop offset="0%" stopColor="#716df2" />
      <stop offset="52%" stopColor={baseColor} />
      <stop offset="100%" stopColor="#29255f" />
     </linearGradient>
     <radialGradient id={auraGrad} cx="50%" cy="38%" r="70%">
      <stop offset="0%" stopColor={accentColor} stopOpacity="0.34" />
      <stop offset="52%" stopColor="#5B7CFA" stopOpacity="0.18" />
      <stop offset="100%" stopColor="#5B7CFA" stopOpacity="0" />
     </radialGradient>
     <linearGradient id={panelGrad} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#131145" />
      <stop offset="100%" stopColor="#090716" />
     </linearGradient>
     <linearGradient id={chinGrad} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#232d63" />
      <stop offset="100%" stopColor="#0c1025" />
     </linearGradient>
    </defs>

    <ellipse cx="100" cy="84" rx="94" ry="86" fill={`url(#${auraGrad})`} opacity={pulseOpacity} />

    {speaking && (
     <rect x="18" y="18" width="164" height="126" rx="34" fill="none" stroke={accentColor} strokeWidth="2.5">
      <animate attributeName="x" values="18;8;18" dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="width" values="164;184;164" dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="y" values="18;12;18" dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="height" values="126;138;126" dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.55;0;0.55" dur="1.1s" repeatCount="indefinite" />
     </rect>
    )}

    <line x1="100" y1="24" x2="100" y2="8" stroke={baseColor} strokeWidth="5" strokeLinecap="round" />
    <circle cx="100" cy="6" r="8" fill={accentColor} filter={`url(#${ledGlow})`}>
     {speaking && <animate attributeName="r" values="8;12;8" dur="0.9s" repeatCount="indefinite" />}
     {speaking && <animate attributeName="opacity" values="1;0.4;1" dur="0.9s" repeatCount="indefinite" />}
    </circle>

    <rect x="13" y="52" width="16" height="32" rx="8" fill={baseColor} />
    <circle cx="21" cy="68" r="6" fill={accentColor} />
    <rect x="171" y="52" width="16" height="32" rx="8" fill={baseColor} />
    <circle cx="179" cy="68" r="6" fill={accentColor} />

    <path d="M31 48 L20 58 L20 108 L31 118" fill="none" stroke="#20295B" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
    <path d="M169 48 L180 58 L180 108 L169 118" fill="none" stroke="#20295B" strokeWidth="8" strokeLinecap="round" opacity="0.85" />

    <rect x="28" y="22" width="144" height="122" rx="30" fill={`url(#${headGrad})`} filter={speaking ? `url(#${glowId})` : undefined} />
    <path d="M45 34 Q100 8 155 34" fill="none" stroke="#A8B5FF" strokeOpacity="0.22" strokeWidth="4" />
    <rect x="40" y="34" width="120" height="7" rx="4" fill="#8EA2FF" opacity="0.15" />

    <rect x="57" y={browY} width="30" height="5" rx="3" fill={accentColor} transform={lBrowRot} />
    <rect x="113" y={browY} width="30" height="5" rx="3" fill={accentColor} transform={rBrowRot} />

    <rect x="42" y="40" width="116" height="88" rx="20" fill={`url(#${panelGrad})`} />
    <rect x="48" y="46" width="104" height="76" rx="16" fill="#070614" stroke="#4E57B4" strokeOpacity="0.38" />
    <path d="M56 52 H144" stroke="#A7B5FF" strokeOpacity="0.15" strokeWidth="3" strokeLinecap="round" />
    <path d="M56 118 H144" stroke="#A7B5FF" strokeOpacity="0.09" strokeWidth="3" strokeLinecap="round" />

    <rect x="54" y={eyeY - eyeH / 2} width="42" height={eyeH} rx={Math.min(10, eyeH / 2 + 1)} fill={accentColor} filter={`url(#${ledGlow})`} />
    {eyeH > 10 && <circle cx="82" cy={eyeY - eyeH / 4} r="4" fill="white" opacity="0.7" />}

    <rect x="104" y={eyeY - eyeH / 2} width="42" height={eyeH} rx={Math.min(10, eyeH / 2 + 1)} fill={accentColor} filter={`url(#${ledGlow})`} />
    {eyeH > 10 && <circle cx="132" cy={eyeY - eyeH / 4} r="4" fill="white" opacity="0.7" />}

    <circle cx="58" cy="104" r="5" fill={accentColor} opacity="0.25" />
    <circle cx="142" cy="104" r="5" fill={accentColor} opacity="0.25" />

    <rect x={mx - 10} y={myBase - 8} width={mw + 20} height={compact ? 28 : 34} rx="10" fill="#050411" stroke="#4E57B4" strokeOpacity="0.28" />

    {openRatio > 0.1 ? (
     <rect x={mx} y={myBase - openRatio * 6} width={mw} height={mouthH} rx="5" fill={accentColor} filter={`url(#${ledGlow})`} />
    ) : expression === "happy" || expression === "encouraging" ? (
     <path d={`M ${mx + 4} ${myBase + 2} Q 100 ${myBase + 16} ${mx + mw - 4} ${myBase + 2}`} stroke={accentColor} strokeWidth="5" fill="none" strokeLinecap="round" filter={`url(#${ledGlow})`} />
    ) : expression === "concerned" ? (
     <path d={`M ${mx + 4} ${myBase + 14} Q 100 ${myBase + 4} ${mx + mw - 4} ${myBase + 14}`} stroke={accentColor} strokeWidth="5" fill="none" strokeLinecap="round" />
    ) : (
     <rect x={mx + 6} y={myBase + 7} width={mw - 12} height="5" rx="3" fill={accentColor} opacity="0.75" />
    )}

    {expression === "thinking" && (
     <>
      <circle cx="154" cy="58" r="5" fill={accentColor} opacity="0.9" />
      <circle cx="167" cy="46" r="4" fill={accentColor} opacity="0.6" />
      <circle cx="177" cy="36" r="3" fill={accentColor} opacity="0.3" />
     </>
    )}

    {expression === "encouraging" && (
     <>
      <path d="M161 44 L164 50 L171 51 L166 56 L167 63 L161 60 L155 63 L156 56 L151 51 L158 50 Z" fill={accentColor} opacity="0.95" />
      <path d="M22 64 L24 69 L29 70 L25 74 L26 79 L22 76 L18 79 L19 74 L15 70 L20 69 Z" fill={accentColor} opacity="0.72" />
     </>
    )}

    <path d="M67 140 H133 L124 159 H76 Z" fill={`url(#${chinGrad})`} />
    <rect x="82" y="142" width="36" height="20" rx="6" fill={baseColor} />
    <rect x="82" y="152" width="36" height="6" rx="3" fill={accentColor} />
    <rect x="72" y="162" width="56" height="10" rx="5" fill="#10172D" stroke="#2B3872" strokeOpacity="0.65" />
   </svg>
  </div>
 );
}
function RoundBot({ speaking, expression, size, accentColor, baseColor, compact, blink, openRatio, bobPx }: BotProps) {
 const glowId  = "rd-rb-glow";
 const headGrad = "rd-rb-head";

 const eyeRY = blink ? 2 : expression === "surprised" ? 26 : 22;
 const mouthY = compact ? 112 : 120;
 const browY  = expression === "surprised" ? 50 : expression === "happy" ? 60 : 56;
 const lBrowRot = expression === "thinking" ? "rotate(-8,72,60)" : expression === "concerned" ? "rotate(8,72,60)"  : "rotate(0)";
 const rBrowRot = expression === "thinking" ? "rotate(8,128,60)" : expression === "concerned" ? "rotate(-8,128,60)" : "rotate(0)";

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

    
    {speaking && (
     <circle cx="100" cy="88" r="80" fill="none" stroke={accentColor} strokeWidth="2.5">
      <animate attributeName="r"    values="78;92;78"  dur="1s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.55;0;0.55" dur="1s" repeatCount="indefinite" />
     </circle>
    )}

    
    <circle cx="24" cy="88" r="16" fill={baseColor} filter={speaking ? `url(#${glowId})` : undefined} />
    <circle cx="176" cy="88" r="16" fill={baseColor} />
    <circle cx="24" cy="88" r="9" fill={accentColor} />
    <circle cx="176" cy="88" r="9" fill={accentColor} />

    
    <circle cx="100" cy="88" r="72"
     fill={`url(#${headGrad})`}
     filter={speaking ? `url(#${glowId})` : undefined}
    />

    
    <circle cx="82" cy="20" r="8" fill={baseColor} />
    <circle cx="118" cy="20" r="8" fill={baseColor} />
    <circle cx="82" cy="20" r="5" fill={accentColor} />
    <circle cx="118" cy="20" r="5" fill={accentColor} />

    
    <rect x="53" y={browY} width="30" height="5" rx="3" fill={accentColor} transform={lBrowRot} />
    <rect x="117" y={browY} width="30" height="5" rx="3" fill={accentColor} transform={rBrowRot} />

    
    <ellipse cx="72" cy="82" rx="22" ry={eyeRY} fill="white" />
    {!blink && (
     <>
      <circle cx="75" cy="85" r="15" fill={baseColor} />
      <circle cx="80" cy="80" r="5" fill="white" />
      <circle cx="78" cy="86" r="7" fill="#0a0a1a" />
     </>
    )}
    
    {!blink && (expression === "happy" || expression === "encouraging") && (
     <path d="M 50 89 Q 72 104 94 89" stroke="#3d3a9e" strokeWidth="8" fill="none" />
    )}

    
    <ellipse cx="128" cy="82" rx="22" ry={eyeRY} fill="white" />
    {!blink && (
     <>
      <circle cx="131" cy="85" r="15" fill={baseColor} />
      <circle cx="136" cy="80" r="5" fill="white" />
      <circle cx="134" cy="86" r="7" fill="#0a0a1a" />
     </>
    )}
    {!blink && (expression === "happy" || expression === "encouraging") && (
     <path d="M 106 89 Q 128 104 150 89" stroke="#3d3a9e" strokeWidth="8" fill="none" />
    )}

    
    {(expression === "happy" || expression === "encouraging") && (
     <>
      <ellipse cx="48" cy="108" rx="15" ry="9" fill={accentColor} opacity="0.22" />
      <ellipse cx="152" cy="108" rx="15" ry="9" fill={accentColor} opacity="0.22" />
     </>
    )}

    
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

    
    {expression === "thinking" && (
     <>
      <circle cx="154" cy="54" r="5" fill={accentColor} opacity="0.9" />
      <circle cx="166" cy="42" r="4" fill={accentColor} opacity="0.6" />
      <circle cx="176" cy="32" r="3" fill={accentColor} opacity="0.3" />
     </>
    )}

    
    {expression === "encouraging" && (
     <>
      <text x="158" y="50" fontSize="18" fill={accentColor}>?</text>
      <text x="18" y="66" fontSize="14" fill={accentColor} opacity="0.8">?</text>
     </>
    )}

    
    <rect x="82" y="158" width="36" height="20" rx="6" fill={baseColor} />
    <rect x="82" y="168" width="36" height="6" rx="3" fill={accentColor} />
   </svg>
  </div>
 );
}
function ClassicBot({ speaking, expression, size, accentColor, baseColor, compact, blink, openRatio, bobPx }: BotProps) {
 const glowId = "rd-cl-glow";

 const mouthH = compact ? 6 + openRatio * 10 : 8 + openRatio * 16;
 const eyeRY = expression === "happy" || expression === "encouraging" ? 9
  : expression === "surprised" ? 24 : 20;
 const browY   = expression === "thinking" ? 62 : expression === "surprised" ? 58 : expression === "happy" ? 70 : 66;
 const lBrowRot = expression === "thinking" ? "rotate(-6,73,68)" : expression === "concerned" ? "rotate(6,73,68)"  : "rotate(0,73,68)";
 const rBrowRot = expression === "thinking" ? "rotate(6,127,68)" : expression === "concerned" ? "rotate(-6,127,68)" : "rotate(0,127,68)";
 const mouthY  = compact ? 118 : 130;
 const mouthW  = compact ? 22 : 30;
 const jawY   = compact ? mouthY + 6 + openRatio * 6 : mouthY + 8 + openRatio * 10;

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

    
    {speaking && (
     <ellipse cx="100" cy="98" rx="78" ry="83" fill="none" stroke={accentColor} strokeWidth="2.5">
      <animate attributeName="rx"   values="78;88;78"  dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="ry"   values="83;94;83"  dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0;0.5"  dur="1.1s" repeatCount="indefinite" />
     </ellipse>
    )}

    
    <ellipse cx="100" cy="98" rx="72" ry="76" fill={baseColor} filter={speaking ? `url(#${glowId})` : undefined} />
    <ellipse cx="100" cy="103" rx="56" ry="60" fill="#4a47a3" />
    <path d="M 38 72 Q 100 20 162 72" stroke={accentColor} strokeWidth="11" fill="none" strokeLinecap="round" />
    <ellipse cx="28" cy="100" rx="10" ry="15" fill={accentColor} />
    <ellipse cx="172" cy="100" rx="10" ry="15" fill={accentColor} />

    
    <rect x="55" y={browY} width="34" height="5" rx="3" fill={accentColor} transform={lBrowRot} />
    <rect x="111" y={browY} width="34" height="5" rx="3" fill={accentColor} transform={rBrowRot} />

    
    <ellipse cx="73" cy="93" rx="19" ry={blink ? 2 : eyeRY} fill="white" />
    {!blink && (
     <>
      <circle cx="76" cy="96" r="11" fill="#12112e" />
      <circle cx="80" cy="91" r="4" fill="white" />
      <circle cx="79" cy="97" r="5" fill="#12112e" />
     </>
    )}

    
    <ellipse cx="127" cy="93" rx="19" ry={blink ? 2 : eyeRY} fill="white" />
    {!blink && (
     <>
      <circle cx="130" cy="96" r="11" fill="#12112e" />
      <circle cx="134" cy="91" r="4" fill="white" />
      <circle cx="133" cy="97" r="5" fill="#12112e" />
     </>
    )}

    
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

    
    <rect x="82" y="172" width="36" height="22" rx="6" fill={baseColor} />
    <rect x="82" y="182" width="36" height="6" rx="3" fill={accentColor} />

    
    {expression === "thinking" && (
     <>
      <circle cx="150" cy="60" r="5" fill={accentColor} opacity="0.9" />
      <circle cx="163" cy="48" r="4" fill={accentColor} opacity="0.6" />
      <circle cx="174" cy="38" r="3" fill={accentColor} opacity="0.3" />
     </>
    )}
    {expression === "encouraging" && (
     <>
      <text x="158" y="55" fontSize="18" fill={accentColor}>?</text>
      <text x="22" y="70" fontSize="14" fill={accentColor} opacity="0.7">?</text>
     </>
    )}
   </svg>
  </div>
 );
}
function TeachingBot({ speaking, expression, size, accentColor, baseColor, blink, openRatio, bobPx }: BotProps) {
 const glowId = "rd-tb-glow";
 const ledGlow = "rd-tb-led";
 const bodyGrad = "rd-tb-body";
 const screenGrad = "rd-tb-screen";
 const eyeH = blink ? 3
  : expression === "surprised"               ? 22
  : expression === "happy" || expression === "encouraging" ? 9
  : expression === "thinking"               ? 11
  : 16;

 const mouthH = 4 + openRatio * 14;
 const mouthY = 126;
 const w = 200, h = 320;
 const pointRot = expression === "encouraging" ? -25
  : expression === "happy"   ? -15
  : speaking           ? -10
  : 0;

 return (
  <div style={{
   width: size, height: Math.round(size * 1.6),
   display: "inline-flex", alignItems: "center", justifyContent: "center",
   transform: `translateY(${bobPx}px)`, transition: "transform 0.18s ease", flexShrink: 0,
  }}>
   <svg viewBox={`0 0 ${w} ${h}`} width={size} height={Math.round(size * 1.6)} aria-hidden="true" style={{ overflow: "visible" }}>
    <defs>
     <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="7" result="blur" />
      <feFlood floodColor={accentColor} floodOpacity="0.45" result="c" />
      <feComposite in="c" in2="blur" operator="in" result="glow" />
      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
     </filter>
     <filter id={ledGlow} x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feFlood floodColor={accentColor} floodOpacity="0.9" result="c" />
      <feComposite in="c" in2="blur" operator="in" result="glow" />
      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
     </filter>
     <linearGradient id={bodyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#7B75E8" />
      <stop offset="100%" stopColor={baseColor} />
     </linearGradient>
     <linearGradient id={screenGrad} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#0D1B2A" />
      <stop offset="100%" stopColor="#060A12" />
     </linearGradient>
    </defs>

    
    <ellipse cx="100" cy="315" rx="45" ry="7" fill="#00000040" />

    
    
    <rect x="72" y="245" width="24" height="55" rx="10" fill={`url(#${bodyGrad})`} />
    <rect x="68" y="290" width="32" height="14" rx="7" fill={baseColor} />
    
    <rect x="104" y="245" width="24" height="55" rx="10" fill={`url(#${bodyGrad})`} />
    <rect x="100" y="290" width="32" height="14" rx="7" fill={baseColor} />

    
    <rect x="54" y="168" width="92" height="82" rx="16" fill={`url(#${bodyGrad})`} />

    
    <rect x="66" y="180" width="68" height="48" rx="8" fill={`url(#${screenGrad})`} stroke={accentColor} strokeWidth="1.5" />
    
    {speaking ? (
     <>
      {[0,1,2,3].map(row => (
       <rect key={row} x="72" y={187 + row * 10} width={20 + (row % 3) * 18} height="5" rx="2"
        fill={accentColor} opacity={0.4 + row * 0.15}>
        <animate attributeName="width" values={`${20 + row * 10};${40 + row * 5};${20 + row * 10}`}
         dur={`${0.6 + row * 0.15}s`} repeatCount="indefinite" />
       </rect>
      ))}
     </>
    ) : (
     <>
      
      <circle cx="100" cy="197" r="7" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
      <line x1="94" y1="204" x2="88" y2="210" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
      <line x1="106" y1="204" x2="112" y2="210" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
      <text x="100" y="225" textAnchor="middle" fontSize="8" fill={accentColor} opacity="0.7" fontWeight="bold">SPARQ</text>
     </>
    )}

    
    {[0,1,2].map(i => (
     <circle key={i} cx={76 + i * 14} cy={233} r="4" fill={accentColor} opacity={speaking ? 0.4 + i * 0.2 : 0.2}>
      {speaking && <animate attributeName="opacity" values={`${0.2 + i * 0.2};1;${0.2 + i * 0.2}`}
       dur={`${0.4 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} />}
     </circle>
    ))}

    
    <circle cx="54" cy="185" r="12" fill={`url(#${bodyGrad})`} stroke={accentColor} strokeWidth="1.5" />
    <circle cx="146" cy="185" r="12" fill={`url(#${bodyGrad})`} stroke={accentColor} strokeWidth="1.5" />

    
    <g transform={`rotate(${pointRot}, 54, 185)`} style={{ transition: "transform 0.4s ease" }}>
     
     <rect x="24" y="175" width="30" height="18" rx="9" fill={`url(#${bodyGrad})`} />
     
     <circle cx="24" cy="184" r="9" fill={`url(#${bodyGrad})`} />
     
     <rect x="0" y="174" width="28" height="16" rx="8" fill={`url(#${bodyGrad})`} transform="rotate(-35,24,184)" />
     
     <g transform="translate(-8, 152)">
      <ellipse cx="14" cy="24" rx="10" ry="12" fill={`url(#${bodyGrad})`} />
      
      <rect x="17" y="10" width="7" height="18" rx="3" fill={accentColor} />
      
      {(expression === "encouraging" || expression === "happy") && (
       <circle cx="20" cy="10" r="4" fill={accentColor} filter={`url(#${ledGlow})`}>
        <animate attributeName="r" values="4;6;4" dur="0.8s" repeatCount="indefinite" />
       </circle>
      )}
     </g>
    </g>

    
    <g transform={speaking ? "rotate(10,146,185)" : "rotate(0,146,185)"} style={{ transition: "transform 0.3s ease" }}>
     
     <rect x="146" y="175" width="30" height="18" rx="9" fill={`url(#${bodyGrad})`} />
     
     <circle cx="176" cy="184" r="9" fill={`url(#${bodyGrad})`} />
     
     <rect x="172" y="174" width="28" height="16" rx="8" fill={`url(#${bodyGrad})`} />
     
     <ellipse cx="186" cy="196" rx="10" ry="12" fill={`url(#${bodyGrad})`} />
    </g>

    
    <rect x="86" y="158" width="28" height="16" rx="6" fill={baseColor} />
    <rect x="89" y="163" width="22" height="5" rx="2" fill={accentColor} opacity="0.6" />

    
    <rect x="56" y="70" width="88" height="90" rx="22" fill={`url(#${bodyGrad})`} filter={speaking ? `url(#${glowId})` : "none"} />

    
    <line x1="100" y1="70" x2="100" y2="52" stroke={baseColor} strokeWidth="5" strokeLinecap="round" />
    <circle cx="100" cy="48" r="8" fill={accentColor} filter={`url(#${ledGlow})`}>
     {speaking && <animate attributeName="r" values="8;11;8" dur="0.9s" repeatCount="indefinite" />}
     {speaking && <animate attributeName="opacity" values="1;0.4;1" dur="0.9s" repeatCount="indefinite" />}
    </circle>

    
    <rect x="43" y="90" width="14" height="28" rx="7" fill={baseColor} />
    <circle cx="50" cy="104" r="5" fill={accentColor} />
    <rect x="143" y="90" width="14" height="28" rx="7" fill={baseColor} />
    <circle cx="150" cy="104" r="5" fill={accentColor} />

    
    <rect x="65" y="80" width="70" height="68" rx="14" fill="#0D1B2A" />

    
    <rect x="74" y={110 - eyeH / 2} width="26" height={eyeH} rx={eyeH / 2}
     fill={accentColor} filter={`url(#${ledGlow})`} />
    <rect x="100" y={110 - eyeH / 2} width="26" height={eyeH} rx={eyeH / 2}
     fill={accentColor} filter={`url(#${ledGlow})`} />

    
    <line x1="74" y1={104 - (expression === "surprised" ? 8 : 3)} x2="100" y2={104 - (expression === "surprised" ? 8 : 3)}
     stroke={accentColor} strokeWidth="3" strokeLinecap="round" opacity="0.7"
     transform={expression === "thinking" ? "rotate(-7,87,101)" : expression === "concerned" ? "rotate(7,87,101)" : ""} />
    <line x1="100" y1={104 - (expression === "surprised" ? 8 : 3)} x2="126" y2={104 - (expression === "surprised" ? 8 : 3)}
     stroke={accentColor} strokeWidth="3" strokeLinecap="round" opacity="0.7"
     transform={expression === "thinking" ? "rotate(7,113,101)" : expression === "concerned" ? "rotate(-7,113,101)" : ""} />

    
    <rect x={80} y={mouthY} width={40} height={mouthH} rx={mouthH / 2} fill={accentColor}
     filter={`url(#${ledGlow})`} />
    
    {(expression === "happy" || expression === "encouraging") && openRatio < 0.2 && (
     <path d="M 83 132 Q 100 143 117 132" stroke={accentColor} strokeWidth="4" fill="none" strokeLinecap="round" />
    )}
    
    {expression === "concerned" && openRatio < 0.2 && (
     <path d="M 83 140 Q 100 130 117 140" stroke={accentColor} strokeWidth="4" fill="none" strokeLinecap="round" />
    )}

    
    {speaking && (
     <rect x="52" y="66" width="96" height="98" rx="26" fill="none" stroke={accentColor} strokeWidth="2">
      <animate attributeName="x"    values="52;42;52"   dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="width"  values="96;116;96"  dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="y"    values="66;60;66"   dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="height" values="98;110;98"  dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0;0.5"  dur="1.1s" repeatCount="indefinite" />
     </rect>
    )}

    
    {expression === "thinking" && (
     <>
      <circle cx="140" cy="88" r="5" fill={accentColor} opacity="0.9" />
      <circle cx="152" cy="76" r="4" fill={accentColor} opacity="0.6" />
      <circle cx="162" cy="66" r="3" fill={accentColor} opacity="0.3" />
     </>
    )}
    
    {expression === "encouraging" && (
     <>
      <text x="146" y="95" fontSize="16" fill={accentColor}>?</text>
      <text x="38" y="108" fontSize="12" fill={accentColor} opacity="0.7">?</text>
     </>
    )}
   </svg>
  </div>
 );
}
function NovaBot({ speaking, expression, size, blink, openRatio, bobPx }: BotProps) {
 const novaAccent = "#E91E87";
 const novaBase  = "#5C3DA8";

 const eyeH = blink ? 3
  : expression === "surprised"               ? 22
  : expression === "happy" || expression === "encouraging" ? 9
  : expression === "thinking"               ? 10
  : 15;

 const mouthH = 4 + openRatio * 14;
 const w = 200, h = 320;

 const armRot = expression === "encouraging" ? -30
  : expression === "happy" ? -20
  : speaking ? -12 : 0;

 return (
  <div style={{
   width: size, height: Math.round(size * 1.6),
   display: "inline-flex", alignItems: "center", justifyContent: "center",
   transform: `translateY(${bobPx}px)`, transition: "transform 0.18s ease", flexShrink: 0,
  }}>
   <svg viewBox={`0 0 ${w} ${h}`} width={size} height={Math.round(size * 1.6)} aria-hidden="true" style={{ overflow: "visible" }}>
    <defs>
     <filter id="nova-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="7" result="blur" />
      <feFlood floodColor={novaAccent} floodOpacity="0.5" result="c" />
      <feComposite in="c" in2="blur" operator="in" result="glow" />
      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
     </filter>
     <filter id="nova-led" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feFlood floodColor={novaAccent} floodOpacity="0.9" result="c" />
      <feComposite in="c" in2="blur" operator="in" result="glow" />
      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
     </filter>
     <linearGradient id="nova-body" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#C47FE8" />
      <stop offset="100%" stopColor={novaBase} />
     </linearGradient>
     <linearGradient id="nova-screen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#1A0D2E" />
      <stop offset="100%" stopColor="#060812" />
     </linearGradient>
    </defs>

    <ellipse cx="100" cy="315" rx="45" ry="7" fill="#00000040" />

    
    <rect x="74" y="245" width="22" height="52" rx="11" fill="url(#nova-body)" />
    <rect x="70" y="288" width="30" height="12" rx="6" fill={novaBase} />
    <rect x="104" y="245" width="22" height="52" rx="11" fill="url(#nova-body)" />
    <rect x="100" y="288" width="30" height="12" rx="6" fill={novaBase} />

    
    <rect x="48" y="165" width="104" height="85" rx="20" fill="url(#nova-body)" />
    <ellipse cx="100" cy="250" rx="52" ry="14" fill="url(#nova-body)" opacity="0.5" />

    
    <rect x="62" y="177" width="76" height="52" rx="10" fill="url(#nova-screen)" stroke={novaAccent} strokeWidth="1.5" />
    {speaking ? (
     <>
      {[0,1,2,3].map(row => (
       <rect key={row} x="68" y={184 + row * 11} width={18 + (row % 3) * 14} height="5" rx="2"
        fill={novaAccent} opacity={0.35 + row * 0.15}>
        <animate attributeName="width" values={`${18 + row * 8};${36 + row * 4};${18 + row * 8}`}
         dur={`${0.55 + row * 0.12}s`} repeatCount="indefinite" />
       </rect>
      ))}
     </>
    ) : (
     <>
      <path d="M88 200 Q88 193 94 193 Q100 193 100 200 Q100 193 106 193 Q112 193 112 200 Q112 208 100 216 Q88 208 88 200Z"
       fill={novaAccent} opacity="0.55" />
      <text x="100" y="232" textAnchor="middle" fontSize="8" fill={novaAccent} opacity="0.8" fontWeight="bold">NOVA</text>
     </>
    )}

    
    {[0,1,2].map(i => (
     <circle key={i} cx={74 + i * 14} cy={234} r="3.5" fill={novaAccent} opacity={speaking ? 0.4 + i * 0.2 : 0.2}>
      {speaking && (
       <animate attributeName="opacity" values={`${0.2 + i * 0.2};1;${0.2 + i * 0.2}`}
        dur={`${0.35 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.12}s`} />
      )}
     </circle>
    ))}

    
    <circle cx="48" cy="182" r="13" fill="url(#nova-body)" stroke={novaAccent} strokeWidth="1.5" />
    <circle cx="152" cy="182" r="13" fill="url(#nova-body)" stroke={novaAccent} strokeWidth="1.5" />

    
    <g transform={`rotate(${armRot}, 48, 182)`} style={{ transition: "transform 0.4s ease" }}>
     <rect x="18" y="172" width="30" height="18" rx="9" fill="url(#nova-body)" />
     <circle cx="18" cy="181" r="9" fill="url(#nova-body)" />
     <g transform="translate(-16,150)">
      <ellipse cx="14" cy="22" rx="10" ry="11" fill="url(#nova-body)" />
      <rect x="17" y="9" width="7" height="16" rx="3" fill={novaAccent} />
      {(expression === "encouraging" || expression === "happy") && (
       <circle cx="20" cy="9" r="4" fill={novaAccent} filter="url(#nova-led)">
        <animate attributeName="r" values="4;7;4" dur="0.75s" repeatCount="indefinite" />
       </circle>
      )}
     </g>
    </g>

    
    <g transform={speaking ? "rotate(8,152,182)" : "rotate(0,152,182)"} style={{ transition: "transform 0.3s ease" }}>
     <rect x="152" y="172" width="30" height="18" rx="9" fill="url(#nova-body)" />
     <circle cx="182" cy="181" r="9" fill="url(#nova-body)" />
     <rect x="178" y="171" width="26" height="16" rx="8" fill="url(#nova-body)" />
     <ellipse cx="190" cy="193" rx="10" ry="11" fill="url(#nova-body)" />
    </g>

    
    <rect x="86" y="155" width="28" height="16" rx="7" fill={novaBase} />
    <rect x="89" y="160" width="22" height="5" rx="2" fill={novaAccent} opacity="0.6" />

    
    <ellipse cx="100" cy="112" rx="50" ry="52" fill="url(#nova-body)" filter={speaking ? "url(#nova-glow)" : "none"} />

    
    <line x1="68" y1="66" x2="50" y2="44" stroke={novaBase} strokeWidth="5" strokeLinecap="round" />
    <circle cx="46" cy="40" r="9" fill={novaAccent} filter="url(#nova-led)">
     {speaking && <animate attributeName="r" values="9;12;9" dur="1.1s" repeatCount="indefinite" />}
    </circle>
    <line x1="132" y1="66" x2="150" y2="44" stroke={novaBase} strokeWidth="5" strokeLinecap="round" />
    <circle cx="154" cy="40" r="9" fill={novaAccent} filter="url(#nova-led)">
     {speaking && <animate attributeName="r" values="9;12;9" dur="1.1s" repeatCount="indefinite" begin="0.4s" />}
    </circle>

    
    <rect x="38" y="86" width="14" height="26" rx="7" fill={novaBase} />
    <circle cx="45" cy="99" r="5" fill={novaAccent} />
    <rect x="148" y="86" width="14" height="26" rx="7" fill={novaBase} />
    <circle cx="155" cy="99" r="5" fill={novaAccent} />

    
    <ellipse cx="100" cy="112" rx="40" ry="42" fill="#1A0D2E" />

    
    <rect x="74" y={104 - eyeH / 2} width="22" height={eyeH} rx={eyeH / 2} fill={novaAccent} filter="url(#nova-led)" />
    <rect x="104" y={104 - eyeH / 2} width="22" height={eyeH} rx={eyeH / 2} fill={novaAccent} filter="url(#nova-led)" />

    
    {!blink && (
     <>
      <line x1="77" y1={100 - eyeH / 2} x2="75" y2={95 - eyeH / 2} stroke={novaAccent} strokeWidth="1.5" opacity="0.7" />
      <line x1="85" y1={99 - eyeH / 2} x2="84" y2={94 - eyeH / 2} stroke={novaAccent} strokeWidth="1.5" opacity="0.7" />
      <line x1="107" y1={100 - eyeH / 2} x2="105" y2={95 - eyeH / 2} stroke={novaAccent} strokeWidth="1.5" opacity="0.7" />
      <line x1="115" y1={99 - eyeH / 2} x2="114" y2={94 - eyeH / 2} stroke={novaAccent} strokeWidth="1.5" opacity="0.7" />
     </>
    )}

    
    <path d={`M 74 ${96 - (expression === "surprised" ? 7 : 2)} Q 86 ${92 - (expression === "surprised" ? 7 : 2)} 96 ${96 - (expression === "surprised" ? 7 : 2)}`}
     stroke={novaAccent} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"
     transform={expression === "thinking" ? "rotate(-8,85,94)" : expression === "concerned" ? "rotate(8,85,94)" : ""} />
    <path d={`M 104 ${96 - (expression === "surprised" ? 7 : 2)} Q 114 ${92 - (expression === "surprised" ? 7 : 2)} 126 ${96 - (expression === "surprised" ? 7 : 2)}`}
     stroke={novaAccent} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"
     transform={expression === "thinking" ? "rotate(8,115,94)" : expression === "concerned" ? "rotate(-8,115,94)" : ""} />

    
    <circle cx="78" cy="116" r="9" fill={novaAccent} opacity="0.12" />
    <circle cx="122" cy="116" r="9" fill={novaAccent} opacity="0.12" />

    
    <rect x="84" y="128" width="32" height={mouthH} rx={mouthH / 2} fill={novaAccent} filter="url(#nova-led)" />
    {(expression === "happy" || expression === "encouraging") && openRatio < 0.2 && (
     <path d="M 86 133 Q 100 144 114 133" stroke={novaAccent} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    )}
    {expression === "concerned" && openRatio < 0.2 && (
     <path d="M 86 141 Q 100 131 114 141" stroke={novaAccent} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    )}

    
    {speaking && (
     <ellipse cx="100" cy="112" rx="54" ry="56" fill="none" stroke={novaAccent} strokeWidth="2">
      <animate attributeName="rx" values="54;64;54" dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="ry" values="56;66;56" dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0;0.5" dur="1.1s" repeatCount="indefinite" />
     </ellipse>
    )}

    
    {expression === "thinking" && (
     <>
      <circle cx="154" cy="86" r="5" fill={novaAccent} opacity="0.9" />
      <circle cx="165" cy="74" r="4" fill={novaAccent} opacity="0.6" />
      <circle cx="174" cy="64" r="3" fill={novaAccent} opacity="0.3" />
     </>
    )}
    
    {expression === "encouraging" && (
     <>
      <text x="156" y="90" fontSize="16" fill={novaAccent}>?</text>
      <text x="34" y="103" fontSize="12" fill={novaAccent} opacity="0.7">?</text>
     </>
    )}
   </svg>
  </div>
 );
}

