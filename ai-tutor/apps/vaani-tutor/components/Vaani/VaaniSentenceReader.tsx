"use client";

interface Word {
  hindi: string;
  roman?: string;
  english?: string;
}

interface VaaniSentenceReaderProps {
  sentence: string;
  sentenceRoman?: string;
  sentenceEnglish?: string;
  words?: Word[];
  onWordClick?: (word: Word) => void;
  onSentenceClick?: () => void;
}

export default function VaaniSentenceReader({
  sentence,
  sentenceRoman,
  sentenceEnglish,
  words = [],
  onWordClick,
  onSentenceClick,
}: VaaniSentenceReaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Full sentence */}
      <button
        onClick={onSentenceClick}
        style={{
          padding: "16px 20px", borderRadius: 18,
          background: "rgba(249,115,22,0.06)", border: "2px solid rgba(249,115,22,0.25)",
          cursor: "pointer", textAlign: "center",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 900, color: "#172033", lineHeight: 1.4 }}>{sentence}</div>
        {sentenceRoman && <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{sentenceRoman}</div>}
        {sentenceEnglish && <div style={{ fontSize: 14, color: "#64748b", fontStyle: "italic", marginTop: 2 }}>{sentenceEnglish}</div>}
        <div style={{ fontSize: 11, color: "#f97316", marginTop: 8, fontWeight: 600 }}>🔊 Tap to hear full sentence</div>
      </button>

      {/* Word breakdown */}
      {words.length > 0 && (
        <div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            Word by Word
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {words.map((word, i) => (
              <button
                key={`${word.hindi}-${i}`}
                onClick={() => onWordClick?.(word)}
                style={{
                  padding: "10px 14px", borderRadius: 14,
                  background: "rgba(59,130,246,0.07)", border: "1.5px solid rgba(59,130,246,0.2)",
                  cursor: "pointer", textAlign: "center", minWidth: 70,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: "#172033" }}>{word.hindi}</div>
                {word.roman && <div style={{ fontSize: 11, color: "#64748b" }}>{word.roman}</div>}
                {word.english && <div style={{ fontSize: 11, color: "#94a3b8" }}>{word.english}</div>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
