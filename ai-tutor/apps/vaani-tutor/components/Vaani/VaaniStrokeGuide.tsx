"use client";

import { useEffect, useMemo, useState } from "react";
import { getStrokeGuide } from "@/lib/vaaniStrokeGuides";

interface VaaniStrokeGuideProps {
  char: string;
  accentColor?: string;
}

export default function VaaniStrokeGuide({
  char,
  accentColor = "#f97316",
}: VaaniStrokeGuideProps) {
  const guide = useMemo(() => getStrokeGuide(char), [char]);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setActiveStep(0);
    setIsPlaying(true);
  }, [char]);

  useEffect(() => {
    if (!guide || !isPlaying) return;

    const interval = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= guide.steps.length - 1) {
          window.clearInterval(interval);
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1200);

    return () => window.clearInterval(interval);
  }, [guide, isPlaying]);

  if (!guide) return null;

  const replay = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(249,115,22,0.08), rgba(255,255,255,0.95))",
        border: "1px solid rgba(249,115,22,0.16)",
        borderRadius: 20,
        padding: 16,
        display: "grid",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: accentColor, textTransform: "uppercase", letterSpacing: 1.1 }}>
            Watch Me Build It
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#172033", marginTop: 4 }}>{guide.title}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{guide.subtitle}</div>
        </div>
        <button
          onClick={replay}
          style={{
            border: "1px solid rgba(249,115,22,0.18)",
            background: "white",
            borderRadius: 14,
            padding: "10px 14px",
            fontSize: 12,
            fontWeight: 800,
            color: accentColor,
            cursor: "pointer",
          }}
        >
          Replay
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 120px) minmax(0, 1fr)", gap: 14, alignItems: "center" }}>
        <div
          style={{
            background: "white",
            borderRadius: 18,
            border: "1px solid rgba(23,32,51,0.08)",
            padding: 10,
            display: "grid",
            placeItems: "center",
            minHeight: 140,
          }}
        >
          <svg viewBox="0 0 100 100" style={{ width: "100%", maxWidth: 120, overflow: "visible" }}>
            {guide.steps.map((step, index) => {
              const isVisible = index <= activeStep;
              const isCurrent = index === activeStep;
              return (
                <path
                  key={step.id}
                  d={step.path}
                  fill="none"
                  stroke={isVisible ? (isCurrent ? accentColor : "#1d4ed8") : "rgba(203,213,225,0.75)"}
                  strokeWidth={isCurrent ? 7 : 6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    opacity: isVisible ? 1 : 0.45,
                    transition: "all 0.35s ease",
                    filter: isCurrent ? `drop-shadow(0 0 8px ${accentColor}55)` : "none",
                  }}
                />
              );
            })}
          </svg>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {guide.steps.map((step, index) => {
            const isDone = index < activeStep;
            const isCurrent = index === activeStep;
            return (
              <div
                key={step.id}
                style={{
                  background: isCurrent ? "rgba(249,115,22,0.10)" : isDone ? "rgba(16,185,129,0.08)" : "white",
                  border: `1px solid ${isCurrent ? "rgba(249,115,22,0.22)" : isDone ? "rgba(16,185,129,0.18)" : "rgba(23,32,51,0.08)"}`,
                  borderRadius: 14,
                  padding: "10px 12px",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: isCurrent ? accentColor : isDone ? "#10b981" : "rgba(23,32,51,0.10)",
                      color: "white",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 11,
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#172033" }}>{step.label}</div>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{step.hint}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          background: "rgba(23,32,51,0.04)",
          borderRadius: 14,
          padding: "10px 12px",
          fontSize: 12,
          color: "#334155",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "#172033" }}>Teacher tip:</strong> {guide.chant}
      </div>
    </div>
  );
}
