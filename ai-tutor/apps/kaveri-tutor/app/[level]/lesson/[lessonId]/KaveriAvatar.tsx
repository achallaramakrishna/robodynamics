"use client";

interface KaveriAvatarProps {
  speaking?: boolean;
  size?: number;
  name?: string;
}

export default function KaveriAvatar({ speaking = false, size = 180, name }: KaveriAvatarProps) {
  return (
    <div
      style={{
        width: size,
        // Portrait ratio — lets the full character show naturally
        flexShrink: 0,
        position: "relative",
        transition: "filter 0.3s ease, transform 0.3s ease",
        transform: speaking ? "scale(1.04)" : "scale(1.00)",
        filter: speaking
          ? "drop-shadow(0 0 18px rgba(249,115,22,0.60)) drop-shadow(0 4px 24px rgba(249,115,22,0.35))"
          : "drop-shadow(0 4px 16px rgba(59,130,246,0.18))",
      }}
      title={name || "Kaveri"}
    >
      {/* Speaking pulse ring — soft ellipse behind the character */}
      {speaking && (
        <div
          style={{
            position: "absolute",
            inset: "-8px -6px",
            borderRadius: 24,
            background: "radial-gradient(ellipse at 50% 90%, rgba(249,115,22,0.18), transparent 70%)",
            animation: "kaveri-glow 1.2s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Kaveri tutor image — full character, no crop */}
      <img
        src="/kaveri/kaveri_tutor.png"
        alt={name || "Kaveri AI Tutor"}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
        }}
      />

      <style>{`
        @keyframes kaveri-glow {
          0%, 100% { opacity: 0.6; transform: scale(1);    }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
