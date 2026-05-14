"use client";

interface KaveriConjunctComparisonProps {
  consonant1: string;
  consonant1Sound?: string;
  consonant2: string;
  consonant2Sound?: string;
  combined: string;
  combinedSound?: string;
  halantForm?: string;
  exampleWord?: string;
  exampleWordEnglish?: string;
  onAudioPlay?: (text: string) => void;
}

export default function KaveriConjunctComparison({
  consonant1,
  consonant1Sound,
  consonant2,
  consonant2Sound,
  combined,
  combinedSound,
  halantForm,
  exampleWord,
  exampleWordEnglish,
  onAudioPlay,
}: KaveriConjunctComparisonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
      {/* Combination formula */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <button
          onClick={() => onAudioPlay?.(consonant1)}
          style={{
            width: 72, height: 72, borderRadius: 16,
            background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.25)",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 34, fontWeight: 900, color: "#172033" }}>{consonant1}</span>
          {consonant1Sound && <span style={{ fontSize: 10, color: "#64748b" }}>{consonant1Sound}</span>}
        </button>

        <span style={{ fontSize: 20, color: "#94a3b8" }}>+</span>

        <button
          onClick={() => onAudioPlay?.(consonant2)}
          style={{
            width: 72, height: 72, borderRadius: 16,
            background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.25)",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 34, fontWeight: 900, color: "#172033" }}>{consonant2}</span>
          {consonant2Sound && <span style={{ fontSize: 10, color: "#64748b" }}>{consonant2Sound}</span>}
        </button>

        <span style={{ fontSize: 20, color: "#94a3b8" }}>=</span>

        <button
          onClick={() => onAudioPlay?.(combined)}
          style={{
            width: 72, height: 72, borderRadius: 16,
            background: "rgba(249,115,22,0.1)", border: "2px solid rgba(249,115,22,0.4)",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 34, fontWeight: 900, color: "#f97316" }}>{combined}</span>
          {combinedSound && <span style={{ fontSize: 10, color: "#64748b" }}>{combinedSound}</span>}
        </button>
      </div>

      {/* Halant form */}
      {halantForm && (
        <div style={{ textAlign: "center", fontSize: 13, color: "#64748b" }}>
          Halant form: <span style={{ fontSize: 18, fontWeight: 700, color: "#7c3aed" }}>{halantForm}</span>
        </div>
      )}

      {/* Example word */}
      {exampleWord && (
        <button
          onClick={() => onAudioPlay?.(exampleWord)}
          style={{
            padding: "10px 16px", borderRadius: 14, border: "1px solid rgba(16,185,129,0.3)",
            background: "rgba(16,185,129,0.06)", cursor: "pointer", textAlign: "center",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 900, color: "#172033" }}>{exampleWord}</span>
          {exampleWordEnglish && (
            <span style={{ fontSize: 13, color: "#64748b", display: "block" }}>{exampleWordEnglish}</span>
          )}
        </button>
      )}
    </div>
  );
}
