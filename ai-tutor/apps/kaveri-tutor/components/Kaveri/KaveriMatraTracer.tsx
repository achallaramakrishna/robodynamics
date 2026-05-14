"use client";

import { useRef, useState } from "react";

interface KaveriMatraTracerProps {
  matra: string;
  baseChar: string;
  onTraceComplete?: () => void;
  completionThreshold?: number;
}

export default function KaveriMatraTracer({
  matra,
  baseChar,
  onTraceComplete,
  completionThreshold = 80,
}: KaveriMatraTracerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    setIsDrawing(true);
    lastPos.current = getPos(e);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing || !lastPos.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
  }

  function endDraw() {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPos.current = null;
    const newStrokes = strokes + 1;
    setStrokes(newStrokes);
    if (newStrokes >= 2) {
      onTraceComplete?.();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 14, color: "#7c3aed", fontWeight: 700 }}>
        Trace: {baseChar} + {matra}
      </div>
      <canvas
        ref={canvasRef}
        width={260}
        height={180}
        style={{
          width: "100%",
          maxWidth: 260,
          borderRadius: 16,
          border: "2px dashed rgba(124,58,237,0.3)",
          background: "white",
          touchAction: "none",
          cursor: "crosshair",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
        Draw the matra mark — {Math.max(0, 2 - strokes)} more stroke{strokes < 1 ? "s" : ""} needed
      </p>
    </div>
  );
}
