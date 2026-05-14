"use client";

import { useState } from "react";

interface ExampleWord {
  word: string;
  english?: string;
}

interface KaveriConjunctRecognitionProps {
  conjunct: string;
  sound?: string;
  exampleWords?: ExampleWord[];
  onRecognize?: () => void;
}

export default function KaveriConjunctRecognition({
  conjunct,
  sound,
  exampleWords = [],
  onRecognize,
}: KaveriConjunctRecognitionProps) {
  const [recognized, setRecognized] = useState(false);

  function handleRecognize() {
    setRecognized(true);
    onRecognize?.();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "12px 0" }}>
      <div
        style={{
          width: 100, height: 100, borderRadius: 24,
          background: "rgba(249,115,22,0.08)", border: "2px solid rgba(249,115,22,0.3)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 52, fontWeight: 900, color: "#f97316" }}>{conjunct}</span>
        {sound && <span style={{ fontSize: 12, color: "#64748b" }}>{sound}</span>}
      </div>

      {exampleWords.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {exampleWords.map((w, i) => (
            <div key={i} style={{ padding: "8px 14px", borderRadius: 12, background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#172033" }}>{w.word}</div>
              {w.english && <div style={{ fontSize: 12, color: "#64748b" }}>{w.english}</div>}
            </div>
          ))}
        </div>
      )}

      {!recognized ? (
        <button
          onClick={handleRecognize}
          style={{
            padding: "10px 24px", borderRadius: 14, background: "#f97316", color: "white",
            border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          ✓ I recognize this conjunct!
        </button>
      ) : (
        <div style={{ color: "#10b981", fontWeight: 700 }}>✅ Excellent!</div>
      )}
    </div>
  );
}
