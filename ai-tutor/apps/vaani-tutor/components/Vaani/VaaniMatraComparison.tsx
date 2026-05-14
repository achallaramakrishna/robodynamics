"use client";

interface VaaniMatraComparisonProps {
  baseChar: string;
  baseSoundRoman?: string;
  matra: string;
  matraSoundRoman?: string;
  modifiedChar: string;
  modifiedSoundRoman?: string;
  onBaseCharClick?: () => void;
  onMatraClick?: () => void;
  onResultClick?: () => void;
  showAnimationOnLoad?: boolean;
}

export default function VaaniMatraComparison({
  baseChar,
  baseSoundRoman,
  matra,
  matraSoundRoman,
  modifiedChar,
  modifiedSoundRoman,
  onBaseCharClick,
  onMatraClick,
  onResultClick,
}: VaaniMatraComparisonProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "20px 0" }}>
      {/* Base char */}
      <button
        onClick={onBaseCharClick}
        style={{
          width: 80, height: 80, borderRadius: 18,
          background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.25)",
          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}
      >
        <span style={{ fontSize: 38, fontWeight: 900, color: "#172033" }}>{baseChar}</span>
        {baseSoundRoman && <span style={{ fontSize: 11, color: "#64748b" }}>{baseSoundRoman}</span>}
      </button>

      {/* Plus sign */}
      <span style={{ fontSize: 24, color: "#94a3b8", fontWeight: 300 }}>+</span>

      {/* Matra */}
      <button
        onClick={onMatraClick}
        style={{
          width: 80, height: 80, borderRadius: 18,
          background: "rgba(124,58,237,0.08)", border: "2px solid rgba(124,58,237,0.25)",
          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}
      >
        <span style={{ fontSize: 38, fontWeight: 900, color: "#7c3aed" }}>{matra}</span>
        {matraSoundRoman && <span style={{ fontSize: 11, color: "#64748b" }}>{matraSoundRoman}</span>}
      </button>

      {/* Equals sign */}
      <span style={{ fontSize: 24, color: "#94a3b8", fontWeight: 300 }}>=</span>

      {/* Result */}
      <button
        onClick={onResultClick}
        style={{
          width: 80, height: 80, borderRadius: 18,
          background: "rgba(249,115,22,0.08)", border: "2px solid rgba(249,115,22,0.35)",
          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}
      >
        <span style={{ fontSize: 38, fontWeight: 900, color: "#f97316" }}>{modifiedChar}</span>
        {modifiedSoundRoman && <span style={{ fontSize: 11, color: "#64748b" }}>{modifiedSoundRoman}</span>}
      </button>
    </div>
  );
}
