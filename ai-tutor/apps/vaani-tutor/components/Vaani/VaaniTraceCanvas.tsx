"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import VaaniStrokeGuide from "@/components/Vaani/VaaniStrokeGuide";

interface VaaniTraceCanvasProps {
  char: string;
  color?: string;
  rounds?: number;                                           // default 3
  onComplete?: () => void;                                   // all rounds done
  onRoundComplete?: (round: number, total: number) => void;  // after each round
}

const ROUND_MESSAGES = [
  "Nice! Now write it one more time →",
  "Excellent! One final trace — your best one! →",
  "Perfect! You've written it 3 times! 🎉",
];

export default function VaaniTraceCanvas({
  char,
  color = "#f97316",
  rounds = 3,
  onComplete,
  onRoundComplete,
}: VaaniTraceCanvasProps) {
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const lastPos           = useRef<{ x: number; y: number } | null>(null);
  const isDrawRef         = useRef(false);
  const hasDrawnRef       = useRef(false);  // any ink on canvas this round?

  const [hasDrawn,        setHasDrawn]        = useState(false);
  const [currentRound,    setCurrentRound]    = useState(1);   // 1-based display
  const [roundsDone,      setRoundsDone]      = useState(0);
  const [flashGreen,      setFlashGreen]      = useState(false);
  const [allDone,         setAllDone]         = useState(false);

  // Draw the faint guide character
  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font         = `${canvas.width * 0.55}px serif`;
    ctx.fillStyle    = "rgba(200,200,200,0.32)";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
  }, [char]);

  // Redraw guide on mount and every new round
  useEffect(() => {
    hasDrawnRef.current = false;
    setHasDrawn(false);
    drawGuide();
  }, [char, currentRound, drawGuide]);

  // ── Pointer helpers ──────────────────────────────────────────────────────────
  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    if (allDone) return;
    isDrawRef.current = true;
    lastPos.current   = getPos(e);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawRef.current || !lastPos.current || allDone) return;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const pos    = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth   = 6;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.stroke();
    lastPos.current = pos;
    // Mark that ink has been put on canvas
    if (!hasDrawnRef.current) {
      hasDrawnRef.current = true;
      setHasDrawn(true);
    }
  }

  function endDraw() {
    if (!isDrawRef.current) return;
    isDrawRef.current = false;
    lastPos.current   = null;
  }

  // ── "Done" button tapped ─────────────────────────────────────────────────────
  function handleDoneRound() {
    const completedNow = roundsDone + 1;
    setRoundsDone(completedNow);
    setFlashGreen(true);

    setTimeout(() => {
      setFlashGreen(false);
      if (completedNow >= rounds) {
        setAllDone(true);
        onComplete?.();
      } else {
        // Next round — useEffect on currentRound will clear canvas + redraw guide
        setCurrentRound(r => r + 1);
        onRoundComplete?.(completedNow, rounds);
      }
    }, 500);
  }

  // ── Progress dots ────────────────────────────────────────────────────────────
  const dots = Array.from({ length: rounds }, (_, i) => i);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>

      {/* ── Round counter ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {dots.map(i => {
          const done   = i < roundsDone;
          const active = i === roundsDone && !allDone;
          return (
            <div
              key={i}
              style={{
                width:  done ? 28 : active ? 26 : 20,
                height: done ? 28 : active ? 26 : 20,
                borderRadius: "50%",
                background: done ? "#10b981" : active ? color : "rgba(23,32,51,0.10)",
                border: `2px solid ${done ? "#10b981" : active ? color : "rgba(23,32,51,0.12)"}`,
                display: "grid", placeItems: "center",
                fontSize: 11, color: "white", fontWeight: 900,
                transition: "all 0.3s ease",
                boxShadow: active ? `0 0 0 4px ${color}22` : done ? "0 0 0 3px #10b98122" : "none",
              }}
            >
              {done && "✓"}
            </div>
          );
        })}
        <span style={{ fontSize: 12, fontWeight: 700, color: allDone ? "#10b981" : "#64748b", marginLeft: 4 }}>
          {allDone ? "All done! 🎉" : `Trace ${Math.min(roundsDone + 1, rounds)} of ${rounds}`}
        </span>
      </div>

      {/* ── Canvas ─────────────────────────────────────────────────────────── */}
      <VaaniStrokeGuide char={char} accentColor={color} />

      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{
          width: "100%", maxWidth: 280,
          borderRadius: 20,
          border: flashGreen || allDone
            ? "2.5px solid #10b981"
            : "2px dashed rgba(59,130,246,0.3)",
          background: flashGreen
            ? "rgba(16,185,129,0.07)"
            : allDone ? "rgba(16,185,129,0.04)" : "white",
          touchAction: "none",
          cursor: allDone ? "default" : "crosshair",
          transition: "border 0.3s ease, background 0.3s ease",
          boxShadow: allDone || flashGreen ? "0 0 0 4px rgba(16,185,129,0.14)" : "none",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />

      {/* ── Done button + status ──────────────────────────────────────────── */}
      {allDone ? (
        <div style={{
          padding: "10px 20px", borderRadius: 20,
          background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)",
          fontSize: 14, color: "#059669", fontWeight: 800, textAlign: "center",
        }}>
          ✅ {char} is in your muscle memory now!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
          <button
            onClick={handleDoneRound}
            disabled={!hasDrawn || flashGreen}
            style={{
              padding: "12px 28px",
              borderRadius: 20,
              border: "none",
              cursor: hasDrawn && !flashGreen ? "pointer" : "not-allowed",
              background: hasDrawn && !flashGreen
                ? `linear-gradient(135deg, ${color}, #fb923c)`
                : "rgba(23,32,51,0.08)",
              color: hasDrawn && !flashGreen ? "white" : "#94a3b8",
              fontWeight: 900, fontSize: 15,
              transition: "all 0.2s ease",
              boxShadow: hasDrawn && !flashGreen
                ? `0 4px 14px ${color}44`
                : "none",
              width: "100%", maxWidth: 280,
            }}
          >
            {flashGreen
              ? "✓ Great!"
              : roundsDone === rounds - 1
                ? `✅ Done — finish!`
                : `✅ Done — trace ${roundsDone + 2} of ${rounds} →`}
          </button>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, textAlign: "center" }}>
            {hasDrawn
              ? (ROUND_MESSAGES[roundsDone] || "Great progress!")
              : `Trace the letter ${char} above, then tap Done`}
          </p>
        </div>
      )}
    </div>
  );
}
