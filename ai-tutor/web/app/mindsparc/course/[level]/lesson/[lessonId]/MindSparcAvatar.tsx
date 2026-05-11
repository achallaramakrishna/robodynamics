"use client";

import { useEffect, useRef, useState } from "react";

// ─── Expression map by mood ───────────────────────────────────────────────────
const EXPRESSION_MAP: Record<string, string> = {
  neutral:      "pose_idle",
  happy:        "pose_happy",
  encouraging:  "pose_encourage",
  thinking:     "pose_thinking",
  concerned:    "pose_concerned",
  celebrating:  "pose_ok_good",
  serious:      "pose_practice",
  surprise:     "pose_happy",
};

// ─── Gesture map by lesson step ───────────────────────────────────────────────
const GESTURE_MAP: Record<string, string> = {
  explain:   "pose_explain",
  question:  "pose_ask_question",
  point:     "pose_demo",
  celebrate: "pose_ok_good",
  write:     "pose_practice",
  idle:      "pose_idle",
  greet:     "pose_greeting",
  count:     "pose_thinking",
};

export type AvatarMood = keyof typeof EXPRESSION_MAP;
export type AvatarGesture = keyof typeof GESTURE_MAP;

export default function MindSparcAvatar({
  speaking = false,
  mood = "neutral",
  gesture = "idle",
  size = 180,
  name = "Sparc",
  label = "Logic Coach",
}: {
  speaking?: boolean;
  mood?: AvatarMood;
  gesture?: AvatarGesture;
  size?: number;
  name?: string;
  label?: string;
}) {
  const [blinking, setBlinking] = useState(false);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Natural blink animation
  useEffect(() => {
    function scheduleBlink() {
      const delay = 2500 + Math.random() * 3500;
      blinkTimerRef.current = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 150);
      }, delay);
    }
    scheduleBlink();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  const gestureSvg = `/teacher_2/svg/${GESTURE_MAP[gesture] ?? GESTURE_MAP.idle}.svg`;
  const expressionSvg = `/teacher_2/svg/${EXPRESSION_MAP[mood] ?? EXPRESSION_MAP.neutral}.svg`;

  const speakAnim = speaking ? "sparc-avatar-pulse 0.55s ease-in-out infinite alternate" : "none";
  const bodyTransform = speaking ? "translateY(-2px) scale(1.12)" : "scale(1.12)";

  const stageWidth = Math.max(240, Math.round(size * 1.55));
  const stageHeight = Math.max(330, Math.round(size * 2.05));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
      <div
        style={{
          position: "relative",
          width: stageWidth,
          maxWidth: "100%",
          height: stageHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 28,
          background: speaking
            ? "linear-gradient(180deg, rgba(14,165,233,0.26), rgba(15,23,42,0.12))"
            : "linear-gradient(180deg, rgba(14,165,233,0.18), rgba(15,23,42,0.08))",
          border: "1px solid rgba(56,189,248,0.30)",
          boxShadow: speaking
            ? "0 0 30px rgba(56,189,248,0.24), inset 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 0 18px rgba(56,189,248,0.14), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 16,
            borderRadius: 22,
            background: "radial-gradient(circle at 50% 22%, rgba(186,230,253,0.22), rgba(15,23,42,0) 62%)",
            pointerEvents: "none",
          }}
        />

        <img
          key={gesture}
          src={gestureSvg}
          alt=""
          style={{
            position: "relative",
            width: "92%",
            height: "92%",
            objectFit: "contain",
            objectPosition: "center bottom",
            transform: bodyTransform,
            animation: `sparc-img-crossfade 0.3s ease both, ${speakAnim}`,
            transformOrigin: "center bottom",
            transition: "transform 0.2s ease",
            filter: speaking ? "drop-shadow(0 8px 16px rgba(15,23,42,0.18))" : "drop-shadow(0 6px 12px rgba(15,23,42,0.10))",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 56,
            height: 56,
            borderRadius: 18,
            overflow: "hidden",
            border: "2px solid rgba(56,189,248,0.6)",
            background: "#0F172A",
            opacity: blinking ? 0.78 : 1,
            transition: "opacity 0.15s",
            boxShadow: "0 8px 24px rgba(15,23,42,0.24)",
          }}
        >
          <img
            key={mood}
            src={expressionSvg}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              animation: "sparc-img-crossfade 0.4s ease both",
            }}
          />
        </div>

        {speaking && (
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#38BDF8", animation: `sparc-bounce 0.9s ${i * 0.15}s ease-in-out infinite` }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ background: "linear-gradient(90deg, #0C4A6E, #075985)", borderRadius: 20, padding: "5px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, border: "1px solid rgba(56,189,248,0.25)" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#F8FAFC", letterSpacing: 0.5 }}>{name}</div>
        <div style={{ fontSize: 10, color: "#38BDF8", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      </div>

      <style>{`
        @keyframes sparc-bounce { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-5px); opacity: 1; } }
        @keyframes sparc-img-crossfade { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
        @keyframes sparc-avatar-pulse { from { transform: scale(1); } to { transform: scale(1.03); } }
      `}</style>
    </div>
  );
}
