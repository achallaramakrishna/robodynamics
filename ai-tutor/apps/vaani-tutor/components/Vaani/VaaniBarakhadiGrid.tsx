"use client";

interface BarakhadiCell {
  syllable: string;
  sound: string;
  matra?: string;
}

interface VaaniBarakhadiGridProps {
  consonant: string;
  consonantRoman?: string;
  barakhadiRow: BarakhadiCell[];
  onCellClick?: (cell: BarakhadiCell) => void;
}

const CELL_COLORS = [
  "rgba(59,130,246,0.08)",
  "rgba(124,58,237,0.08)",
  "rgba(249,115,22,0.08)",
  "rgba(16,185,129,0.08)",
  "rgba(236,72,153,0.08)",
  "rgba(245,158,11,0.08)",
];
const CELL_BORDER_COLORS = [
  "rgba(59,130,246,0.3)",
  "rgba(124,58,237,0.3)",
  "rgba(249,115,22,0.3)",
  "rgba(16,185,129,0.3)",
  "rgba(236,72,153,0.3)",
  "rgba(245,158,11,0.3)",
];

export default function VaaniBarakhadiGrid({
  consonant,
  consonantRoman,
  barakhadiRow,
  onCellClick,
}: VaaniBarakhadiGridProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#172033", textAlign: "center" }}>
        Barakhadi for {consonant}
        {consonantRoman && <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}> ({consonantRoman})</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 8 }}>
        {barakhadiRow.map((cell, i) => (
          <button
            key={`${cell.syllable}-${i}`}
            onClick={() => onCellClick?.(cell)}
            style={{
              height: 72,
              borderRadius: 14,
              background: CELL_COLORS[i % CELL_COLORS.length],
              border: `1.5px solid ${CELL_BORDER_COLORS[i % CELL_BORDER_COLORS.length]}`,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              transition: "transform 0.1s",
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 900, color: "#172033" }}>{cell.syllable}</span>
            <span style={{ fontSize: 10, color: "#64748b" }}>{cell.sound}</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", margin: 0 }}>
        Tap each cell to hear the syllable
      </p>
    </div>
  );
}
