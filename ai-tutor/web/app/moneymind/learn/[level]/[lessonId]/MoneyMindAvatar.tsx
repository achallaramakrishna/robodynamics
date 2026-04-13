"use client";

import { useEffect, useRef, useState } from "react";

const EXPRESSION_MAP: Record<string, string> = {
  neutral:     "pose_idle",
  happy:       "pose_happy",
  encouraging: "pose_encourage",
  thinking:    "pose_thinking",
  concerned:   "pose_concerned",
  celebrating: "pose_ok_good",
  serious:     "pose_practice",
};

const GESTURE_MAP: Record<string, string> = {
  explain:   "pose_explain",
  question:  "pose_ask_question",
  point:     "pose_demo",
  celebrate: "pose_ok_good",
  write:     "pose_practice",
  idle:      "pose_idle",
  greet:     "pose_greeting",
};

export type MeeraMood    = keyof typeof EXPRESSION_MAP;
export type MeeraGesture = keyof typeof GESTURE_MAP;

export default function MoneyMindAvatar({
  speaking = false,
  mood     = "neutral",
  gesture  = "idle",
  size     = 160,
}: {
  speaking?: boolean;
  mood?:     MeeraMood;
  gesture?:  MeeraGesture;
  size?:     number;
}) {
  const [blinking, setBlinking] = useState(false);
  const blinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function scheduleBlink() {
      const delay = 2500 + Math.random() * 3500;
      blinkRef.current = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => { setBlinking(false); scheduleBlink(); }, 150);
      }, delay);
    }
    scheduleBlink();
    return () => { if (blinkRef.current) clearTimeout(blinkRef.current); };
  }, []);

  const gestureSvg    = `/teacher_2/svg/${GESTURE_MAP[gesture]  ?? GESTURE_MAP.idle}.svg`;
  const expressionSvg = `/teacher_2/svg/${EXPRESSION_MAP[mood]  ?? EXPRESSION_MAP.neutral}.svg`;
  const speakAnim     = speaking ? "mm-av-speak 0.55s ease-in-out infinite alternate" : "none";

  const stageW = Math.max(210, Math.round(size * 1.55));
  const stageH = Math.max(290, Math.round(size * 2.05));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
      <div style={{
        position: "relative",
        width: stageW, maxWidth: "100%", height: stageH,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 28,
        background: speaking
          ? "linear-gradient(180deg, rgba(16,185,129,0.30), rgba(6,78,59,0.16))"
          : "linear-gradient(180deg, rgba(16,185,129,0.18), rgba(6,78,59,0.08))",
        border: "1px solid rgba(110,231,183,0.32)",
        boxShadow: speaking
          ? "0 0 32px rgba(16,185,129,0.28), inset 0 0 0 1px rgba(255,255,255,0.08)"
          : "0 0 18px rgba(16,185,129,0.14), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}>
        {/* stage glow */}
        <div style={{
          position: "absolute", inset: 16, borderRadius: 22, pointerEvents: "none",
          background: "radial-gradient(circle at 50% 22%, rgba(167,243,208,0.22), rgba(6,78,59,0) 62%)",
        }} />

        {/* body */}
        <img
          key={gesture}
          src={gestureSvg}
          alt="Meera"
          style={{
            position: "relative",
            width: "92%", height: "92%",
            objectFit: "contain", objectPosition: "center bottom",
            transform: speaking ? "translateY(-2px) scale(1.12)" : "scale(1.12)",
            animation: `mm-av-cross 0.3s ease both, ${speakAnim}`,
            transformOrigin: "center bottom",
            transition: "transform 0.2s ease",
            filter: speaking
              ? "drop-shadow(0 8px 16px rgba(15,23,42,0.20))"
              : "drop-shadow(0 6px 12px rgba(15,23,42,0.12))",
          }}
        />

        {/* expression badge */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          width: 50, height: 50, borderRadius: 14, overflow: "hidden",
          border: "2px solid rgba(110,231,183,0.6)",
          background: "#064E3B",
          opacity: blinking ? 0.75 : 1,
          transition: "opacity 0.15s",
          boxShadow: "0 6px 20px rgba(6,78,59,0.28)",
        }}>
          <img
            key={mood}
            src={expressionSvg}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", animation: "mm-av-cross 0.4s ease both" }}
          />
        </div>

        {/* speaking bounce dots */}
        {speaking && (
          <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: "50%", background: "#F59E0B",
                animation: `mm-av-bounce 0.9s ${i * 0.15}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* name badge */}
      <div style={{
        background: "linear-gradient(90deg, #064E3B, #065F46)",
        borderRadius: 20, padding: "5px 16px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
        border: "1px solid rgba(110,231,183,0.25)",
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#D1FAE5", letterSpacing: 0.5 }}>Meera</div>
        <div style={{ fontSize: 10, color: "#6EE7B7", textTransform: "uppercase", letterSpacing: 1.2 }}>MoneyMind Coach</div>
      </div>

      <style>{`
        @keyframes mm-av-bounce {
          0%, 100% { transform: translateY(0);   opacity: 0.6; }
          50%       { transform: translateY(-5px); opacity: 1;   }
        }
        @keyframes mm-av-cross {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes mm-av-speak {
          from { transform: scale(1.12);    }
          to   { transform: scale(1.145); }
        }
      `}</style>
    </div>
  );
}
