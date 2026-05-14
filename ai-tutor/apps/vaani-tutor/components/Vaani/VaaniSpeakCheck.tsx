"use client";

import { useState } from "react";

interface VaaniSpeakCheckProps {
  targetChar?: string;
  targetWord?: string;
  targetWordEng?: string;
  prompt?: string;
  studentName?: string;
  hindiLevel?: "native" | "some" | "beginner" | "zero";
  onPass?: (correct: boolean) => void;
  onSpeak?: (text: string) => Promise<void> | void;
  romanMap?: Record<string, unknown>;
  autoStart?: boolean;
}

export default function VaaniSpeakCheck({
  targetWord,
  targetWordEng,
  prompt,
  onPass,
}: VaaniSpeakCheckProps) {
  const [state, setState] = useState<"idle" | "listening" | "done">("idle");

  function handleMic() {
    setState("listening");
    // Simulate mic interaction — auto-pass after 2s
    setTimeout(() => {
      setState("done");
      onPass?.(true);
    }, 2000);
  }

  return (
    <div
      style={{
        padding: "16px 20px",
        borderRadius: 20,
        background: "rgba(59,130,246,0.06)",
        border: "1px solid rgba(59,130,246,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        textAlign: "center",
      }}
    >
      {prompt && (
        <p style={{ fontSize: 14, color: "#334155", margin: 0, lineHeight: 1.5 }}>{prompt}</p>
      )}

      {targetWord && (
        <div style={{ fontSize: 28, fontWeight: 900, color: "#172033" }}>
          {targetWord}
          {targetWordEng && (
            <span style={{ fontSize: 14, color: "#64748b", fontWeight: 400, display: "block" }}>
              {targetWordEng}
            </span>
          )}
        </div>
      )}

      {state === "idle" && (
        <button
          onClick={handleMic}
          style={{
            padding: "10px 24px",
            borderRadius: 14,
            background: "#3b82f6",
            color: "white",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          🎙️ Speak
        </button>
      )}

      {state === "listening" && (
        <div style={{ color: "#f97316", fontWeight: 700, fontSize: 14, animation: "pulse 1s infinite" }}>
          🎙️ Listening…
        </div>
      )}

      {state === "done" && (
        <div style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}>
          ✅ Great job!
        </div>
      )}
    </div>
  );
}
