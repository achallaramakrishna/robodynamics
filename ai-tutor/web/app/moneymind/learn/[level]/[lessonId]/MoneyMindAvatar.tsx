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
  speaking  = false,
  mood      = "neutral",
  gesture   = "idle",
  size      = 160,
  bouncing  = false,
}: {
  speaking?:  boolean;
  mood?:      MeeraMood;
  gesture?:   MeeraGesture;
  size?:      number;
  bouncing?:  boolean;
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

  const stageW = Math.max(220, Math.round(size * 1.6));
  const stageH = Math.max(300, Math.round(size * 2.1));

  const MOOD_LABEL: Record<string, string> = {
    neutral: "💬 Ready", happy: "😊 Happy!", encouraging: "💪 You got this!",
    thinking: "🤔 Thinking…", concerned: "😟 Try again!", celebrating: "🎉 Amazing!",
    serious: "📝 Listen up!",
  };

  // Sparkle positions (fixed so no hydration mismatch)
  const sparkles = [
    { top: "12%", left: "8%",  delay: "0s",    size: 14 },
    { top: "18%", right: "6%", delay: "0.4s",  size: 10 },
    { top: "55%", left: "4%",  delay: "0.8s",  size: 12 },
    { top: "70%", right: "5%", delay: "0.2s",  size: 16 },
    { top: "30%", right: "3%", delay: "1.1s",  size: 9  },
  ];

  return (
    <div style={{ display: "inline-block", animation: bouncing ? "meeraBounce 0.8s cubic-bezier(.36,.07,.19,.97) both" : "none", width: "100%" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>

      {/* ── Stage ── */}
      <div style={{
        position: "relative",
        width: stageW, maxWidth: "100%", height: stageH,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 28,
        background: speaking
          ? "linear-gradient(180deg, rgba(16,185,129,0.38) 0%, rgba(6,78,59,0.22) 100%)"
          : "linear-gradient(180deg, rgba(16,185,129,0.22) 0%, rgba(6,78,59,0.10) 100%)",
        border: speaking
          ? "2px solid rgba(110,231,183,0.6)"
          : "1.5px solid rgba(110,231,183,0.28)",
        boxShadow: speaking
          ? "0 0 40px rgba(16,185,129,0.38), 0 0 80px rgba(16,185,129,0.15), inset 0 0 0 1px rgba(255,255,255,0.10)"
          : "0 0 20px rgba(16,185,129,0.16), inset 0 0 0 1px rgba(255,255,255,0.06)",
        transition: "all 0.4s ease",
      }}>
        {/* Spotlight behind avatar */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "80%", height: "60%", pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 90%, rgba(167,243,208,0.28) 0%, transparent 70%)",
        }} />

        {/* Sparkles — only when speaking */}
        {speaking && sparkles.map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            top: s.top, left: "left" in s ? s.left : undefined, right: "right" in s ? (s as { right: string }).right : undefined,
            fontSize: s.size, pointerEvents: "none",
            animation: `mm-sparkle 1.4s ${s.delay} ease-in-out infinite`,
          }}>✨</div>
        ))}

        {/* Avatar body */}
        <img
          key={gesture}
          src={gestureSvg}
          alt="Meera"
          style={{
            position: "relative", zIndex: 2,
            width: "94%", height: "94%",
            objectFit: "contain", objectPosition: "center bottom",
            transform: speaking ? "translateY(-4px) scale(1.14)" : "scale(1.12)",
            animation: `mm-av-cross 0.35s ease both, ${speakAnim}`,
            transformOrigin: "center bottom",
            transition: "transform 0.25s ease",
            filter: speaking
              ? "drop-shadow(0 10px 20px rgba(15,23,42,0.25)) drop-shadow(0 0 12px rgba(16,185,129,0.3))"
              : "drop-shadow(0 6px 14px rgba(15,23,42,0.15))",
          }}
        />

        {/* Expression badge — face thumbnail top-right */}
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 3,
          width: 52, height: 52, borderRadius: 16, overflow: "hidden",
          border: `2px solid ${speaking ? "rgba(250,204,21,0.8)" : "rgba(110,231,183,0.5)"}`,
          background: "#064E3B",
          opacity: blinking ? 0.7 : 1,
          transition: "opacity 0.15s, border-color 0.3s",
          boxShadow: speaking ? "0 0 12px rgba(250,204,21,0.5)" : "0 4px 16px rgba(6,78,59,0.4)",
        }}>
          <img key={mood} src={expressionSvg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", animation: "mm-av-cross 0.4s ease both" }} />
        </div>

        {/* Speaking sound-wave dots */}
        {speaking && (
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, alignItems: "flex-end", zIndex: 3 }}>
            {[0,1,2,1,0].map((h, i) => (
              <div key={i} style={{
                width: 6, borderRadius: 3,
                background: i === 2 ? "#FCD34D" : "#6EE7B7",
                height: `${10 + h * 8}px`,
                animation: `mm-wave 0.7s ${i * 0.12}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Mood pill ── */}
      <div style={{
        background: speaking
          ? "linear-gradient(90deg, #F59E0B, #FCD34D)"
          : "linear-gradient(90deg, #065F46, #047857)",
        borderRadius: 24, padding: "7px 18px",
        fontSize: 13, fontWeight: 800, color: speaking ? "#451A03" : "#D1FAE5",
        letterSpacing: 0.3, transition: "all 0.4s ease",
        boxShadow: speaking ? "0 4px 16px rgba(245,158,11,0.4)" : "0 2px 8px rgba(6,78,59,0.3)",
        animation: speaking ? "mm-mood-pulse 1.4s ease-in-out infinite" : "none",
      }}>
        {MOOD_LABEL[mood] ?? "💬 Ready"}
      </div>

      {/* ── Name badge ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#D1FAE5", letterSpacing: 0.5 }}>Meera</div>
        <div style={{ fontSize: 11, color: "#6EE7B7", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>MoneyMind Coach</div>
      </div>

      <style>{`
        @keyframes mm-av-bounce {
          0%, 100% { transform: translateY(0);    opacity: 0.6; }
          50%       { transform: translateY(-6px); opacity: 1;   }
        }
        @keyframes mm-av-cross {
          from { opacity: 0; transform: scale(1.05); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes mm-av-speak {
          from { transform: scale(1.12);   }
          to   { transform: scale(1.148);  }
        }
        @keyframes mm-wave {
          from { transform: scaleY(0.5); opacity: 0.6; }
          to   { transform: scaleY(1.5); opacity: 1;   }
        }
        @keyframes mm-sparkle {
          0%,100% { transform: scale(1) rotate(0deg);   opacity: 0.7; }
          50%      { transform: scale(1.3) rotate(20deg); opacity: 1;   }
        }
        @keyframes mm-mood-pulse {
          0%,100% { transform: scale(1);    }
          50%      { transform: scale(1.04); }
        }
        @keyframes meeraBounce {
          0%,100%{ transform:translateY(0) scale(1) }
          20%    { transform:translateY(-20px) scale(1.05,0.95) }
          40%    { transform:translateY(-32px) scale(0.94,1.06) }
          60%    { transform:translateY(-14px) scale(1.02,0.98) }
          80%    { transform:translateY(-7px) scale(0.99,1.01) }
        }
        @keyframes mmAvSpeak { 0%{transform:scale(1.12)} 100%{transform:scale(1.148)} }
      `}</style>
    </div>
    </div>
  );
}
