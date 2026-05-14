"use client";

import { useRef, useState } from "react";

interface KaveriConjunctScribeProps {
  conjunct: string;
  sound?: string;
  onScribeComplete?: () => void;
}

export default function KaveriConjunctScribe({
  conjunct,
  sound,
  onScribeComplete,
}: KaveriConjunctScribeProps) {
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
    ctx.strokeStyle = "#f97316";
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
      onScribeComplete?.();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 13, color: "#64748b" }}>
        Write the conjunct: <span style={{ fontSize: 22, fontWeight: 900, color: "#f97316" }}>{conjunct}</span>
        {sound && <span style={{ fontSize: 12, color: "#94a3b8" }}> ({sound})</span>}
      </div>
      <canvas
        ref={canvasRef}
        width={260}
        height={180}
        style={{
          width: "100%", maxWidth: 260, borderRadius: 16,
          border: "2px dashed rgba(249,115,22,0.3)", background: "white",
          touchAction: "none", cursor: "crosshair",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  );
}
