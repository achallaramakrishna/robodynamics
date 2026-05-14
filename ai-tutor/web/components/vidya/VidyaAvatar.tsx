"use client";

import { useEffect, useRef, useState } from "react";

// ─── Expression map by mood for teacher_2 (Priya) ────────────────────────────
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

// ─── Gesture map by lesson step for teacher_2 (Priya) ─────────────────────────
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

export default function VidyaAvatar({
  speaking = false,
  mood = "neutral",
  gesture = "idle",
  size = 200,
  name = "Priya",
  label = "MindSutra Coach",
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
      const delay = 2200 + Math.random() * 3000;
      blinkTimerRef.current = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 140);
      }, delay);
    }
    scheduleBlink();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  const gestureSvg = `/teacher_2/svg/${GESTURE_MAP[gesture] ?? GESTURE_MAP.idle}.svg`;
  const expressionSvg = `/teacher_2/svg/${EXPRESSION_MAP[mood] ?? EXPRESSION_MAP.neutral}.svg`;

  // Speaking animations and styling
  const speakAnim = speaking ? "vidya-avatar-pulse 0.45s ease-in-out infinite alternate" : "none";
  const bodyTransform = speaking ? "translateY(-4px) scale(1.15)" : "scale(1.12)";

  const stageWidth = Math.max(260, Math.round(size * 1.6));
  const stageHeight = Math.max(340, Math.round(size * 2.1));

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Sci-Fi Stage Container */}
      <div
        className="relative flex items-center justify-center rounded-3xl overflow-hidden transition-all duration-300"
        style={{
          width: stageWidth,
          maxWidth: "100%",
          height: stageHeight,
          background: speaking
            ? "linear-gradient(180deg, rgba(99,102,241,0.22) 0%, rgba(30,27,75,0.4) 100%)"
            : "linear-gradient(180deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.6) 100%)",
          border: speaking 
            ? "1px solid rgba(129,140,248,0.5)" 
            : "1px solid rgba(51,65,85,0.4)",
          boxShadow: speaking
            ? "0 0 35px rgba(99,102,241,0.25), inset 0 0 20px rgba(99,102,241,0.15)"
            : "0 0 20px rgba(15,23,42,0.3)",
        }}
      >
        {/* Futuristic Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Dynamic Hologram Rings */}
        {speaking && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="absolute w-[80%] h-[80%] rounded-full border border-indigo-500/10 animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[90%] h-[90%] rounded-full border border-purple-500/5 animate-[spin_30s_linear_infinite_reverse]" />
          </div>
        )}

        {/* Glowing Aura Backing */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-500"
          style={{
            background: speaking
              ? "radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0) 70%)"
              : "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)",
          }}
        />

        {/* Main Teacher Body (teacher_2 Priya) */}
        <img
          key={gesture}
          src={gestureSvg}
          alt="Priya AI Avatar"
          className="relative w-[92%] h-[92%] object-contain object-bottom select-none"
          style={{
            transform: bodyTransform,
            animation: `vidya-img-crossfade 0.35s ease both, ${speakAnim}`,
            transformOrigin: "center bottom",
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: speaking 
              ? "drop-shadow(0 10px 20px rgba(99,102,241,0.3)) brightness(1.05)" 
              : "drop-shadow(0 6px 12px rgba(15,23,42,0.4))",
          }}
        />

        {/* Floating Expression Hub Badge */}
        <div
          className="absolute top-4 right-4 w-16 h-16 rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl"
          style={{
            borderColor: speaking ? "rgba(129,140,248,0.6)" : "rgba(51,65,85,0.5)",
            background: "#0F172A",
            opacity: blinking ? 0.8 : 1,
            boxShadow: "0 10px 30px rgba(15,23,42,0.5)",
          }}
        >
          <img
            key={mood}
            src={expressionSvg}
            alt=""
            className="w-full h-full object-cover object-top select-none"
            style={{
              animation: "vidya-img-crossfade 0.4s ease both",
            }}
          />
          {/* Hologram Scanner Line scan effect */}
          {speaking && (
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 via-indigo-400/20 to-indigo-500/0 animate-[vidya-scan_1.5s_ease-in-out_infinite] pointer-events-none" />
          )}
        </div>

        {/* Speaking Audio Waveform HUD overlay */}
        {speaking && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 items-center bg-indigo-950/70 border border-indigo-500/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-xl">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-indigo-400 to-indigo-300"
                style={{
                  height: 12,
                  animation: `vidya-audio-wave 0.8s ${i * 0.12}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Futuristic Name Badge ── */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 opacity-25 blur transition-all duration-300 group-hover:opacity-45" />
        <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl px-6 py-2 border border-indigo-500/20 text-center shadow-lg">
          <div className="text-sm font-extrabold text-indigo-100 tracking-wider font-sans">{name}</div>
          <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase mt-0.5">{label}</div>
        </div>
      </div>

      {/* Inject Keyframe Styles */}
      <style>{`
        @keyframes vidya-audio-wave {
          0% { height: 4px; }
          100% { height: 16px; }
        }
        @keyframes vidya-img-crossfade {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes vidya-avatar-pulse {
          from { transform: scale(1); }
          to   { transform: scale(1.02); }
        }
        @keyframes vidya-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
