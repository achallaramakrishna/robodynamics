"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type CamState = "idle" | "requesting" | "live" | "captured" | "analyzing" | "result";

export interface ScanResult {
  correct: boolean;
  quality: "excellent" | "good" | "needs_work";
  feedback: string;
  tip: string | null;
}

interface Props {
  targetChar: string;
  studentName: string;
  hindiLevel: "native" | "some" | "beginner" | "zero";
  onResult?: (result: ScanResult) => void;
  onSpeak: (text: string) => void;
  onClose: () => void;
}

const QUALITY_STYLE = {
  excellent: { bg: "rgba(16,185,129,0.10)", border: "#10b981", text: "#047857", stars: "⭐⭐⭐" },
  good:      { bg: "rgba(59,130,246,0.10)",  border: "#3b82f6", text: "#1d4ed8", stars: "⭐⭐" },
  needs_work:{ bg: "rgba(249,115,22,0.10)",  border: "#f97316", text: "#c2410c", stars: "💪" },
};

export default function VaaniCameraCapture({
  targetChar,
  studentName,
  hindiLevel,
  onResult,
  onSpeak,
  onClose,
}: Props) {
  const [camState, setCamState] = useState<CamState>("idle");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isEnglish = hindiLevel === "zero" || hindiLevel === "beginner";

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Open camera ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCamState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" }, // rear camera on phones
          width:  { ideal: 640 },
          height: { ideal: 640 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamState("live");
    } catch {
      // Permission denied or no camera
      setCamState("idle");
    }
  }, []);

  // ── Capture frame from video ─────────────────────────────────────────────
  const capture = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedDataUrl(dataUrl);
    setCamState("captured");

    // Release camera immediately after capture
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  // ── Retake ───────────────────────────────────────────────────────────────
  const retake = useCallback(async () => {
    setCapturedDataUrl(null);
    setScanResult(null);
    await startCamera();
  }, [startCamera]);

  // ── Submit to Vaani (API) ────────────────────────────────────────────────
  const submit = useCallback(async () => {
    if (!capturedDataUrl) return;
    setCamState("analyzing");

    const base64 = capturedDataUrl.replace(/^data:image\/jpeg;base64,/, "");

    const fallback: ScanResult = {
      correct: true,
      quality: "good",
      feedback: isEnglish
        ? `Well done ${studentName}! Keep practising every day!`
        : `शाबाश ${studentName}! रोज़ अभ्यास करते रहो!`,
      tip: null,
    };

    try {
      const resp = await fetch("/vaani/api/vaani/check-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, targetChar, studentName, hindiLevel }),
      });

      const data: ScanResult = resp.ok ? await resp.json() : fallback;
      setScanResult(data);
      setCamState("result");
      onSpeak(data.feedback);
      onResult?.(data);
    } catch {
      setScanResult(fallback);
      setCamState("result");
      onSpeak(fallback.feedback);
      onResult?.(fallback);
    }
  }, [capturedDataUrl, targetChar, studentName, hindiLevel, isEnglish, onResult, onSpeak]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)",
      display: "grid", placeItems: "center", padding: 20,
    }}>
      <div style={{
        background: "white", borderRadius: 32, padding: "26px 22px",
        maxWidth: 430, width: "100%",
        boxShadow: "0 40px 80px rgba(15,23,42,0.30)",
        animation: "vcam-in 0.38s cubic-bezier(0.34,1.56,0.64,1)",
        maxHeight: "90vh", overflowY: "auto",
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 1.3 }}>
              📷 Scan handwriting
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#172033", marginTop: 3, lineHeight: 1.2 }}>
              {isEnglish
                ? `Show Vaani your "${targetChar}"!`
                : `वाणी को अपना "${targetChar}" दिखाओ!`}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: 10,
              border: "none", cursor: "pointer", fontSize: 16,
              background: "rgba(23,32,51,0.08)", color: "#64748b",
            }}
          >✕</button>
        </div>

        {/* ── Instruction banner ── */}
        {(camState === "idle" || camState === "live" || camState === "requesting") && (
          <div style={{
            background: "rgba(124,58,237,0.07)", borderRadius: 13,
            padding: "10px 14px", marginBottom: 14,
            fontSize: 13, color: "#5b21b6", fontWeight: 700, lineHeight: 1.5,
          }}>
            {isEnglish
              ? `✏️ Write "${targetChar}" on white paper with a dark pen, then hold it up to the camera.`
              : `✏️ सफेद कागज़ पर "${targetChar}" लिखो (गहरे रंग की पेन से), फिर camera के सामने रखो।`}
          </div>
        )}

        {/* ── IDLE: open camera button ── */}
        {camState === "idle" && (
          <div style={{ textAlign: "center", paddingTop: 8 }}>
            <div style={{ fontSize: 64, marginBottom: 14 }}>📷</div>
            <button onClick={startCamera} style={{
              width: "100%", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              color: "white", padding: "16px 22px", borderRadius: 18,
              fontWeight: 900, fontSize: 17,
              boxShadow: "0 12px 28px rgba(124,58,237,0.28)",
            }}>
              📷 {isEnglish ? "Open camera" : "Camera खोलो"}
            </button>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 10, fontWeight: 700 }}>
              {isEnglish ? "Camera permission will be asked" : "Camera की permission माँगी जाएगी"}
            </div>
          </div>
        )}

        {/* ── REQUESTING: spinner ── */}
        {camState === "requesting" && (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <div style={{ fontSize: 32, animation: "vcam-spin 1s linear infinite", display: "inline-block", marginBottom: 10 }}>⏳</div>
            <div style={{ fontSize: 15, color: "#64748b", fontWeight: 700 }}>
              {isEnglish ? "Opening camera…" : "Camera खुल रहा है…"}
            </div>
          </div>
        )}

        {/* ── LIVE: video + ghost overlay + capture button ── */}
        {(camState === "live" || camState === "requesting") && (
          <>
            <div style={{
              position: "relative", borderRadius: 20, overflow: "hidden",
              background: "#0f172a", marginBottom: 14, aspectRatio: "1 / 1",
            }}>
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Ghost letter */}
              <div style={{
                position: "absolute", inset: 0, display: "grid", placeItems: "center",
                pointerEvents: "none",
              }}>
                <div style={{
                  fontSize: 130, fontWeight: 900, lineHeight: 1,
                  color: "rgba(255,255,255,0.13)",
                  textShadow: "0 0 50px rgba(124,58,237,0.5)",
                  userSelect: "none",
                }}>
                  {targetChar}
                </div>
              </div>
              {/* Corner guide frame */}
              <div style={{
                position: "absolute", inset: 18,
                border: "2px dashed rgba(124,58,237,0.55)",
                borderRadius: 14, pointerEvents: "none",
              }} />
            </div>
            {camState === "live" && (
              <button onClick={capture} style={{
                width: "100%", border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                color: "white", padding: "16px 22px", borderRadius: 18,
                fontWeight: 900, fontSize: 17,
                boxShadow: "0 12px 28px rgba(124,58,237,0.28)",
              }}>
                📸 {isEnglish ? "Capture!" : "खींचो!"}
              </button>
            )}
          </>
        )}

        {/* ── CAPTURED: preview + retake / submit ── */}
        {camState === "captured" && capturedDataUrl && (
          <>
            <img
              src={capturedDataUrl}
              alt="Your handwriting"
              style={{ width: "100%", borderRadius: 20, marginBottom: 14, display: "block" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={retake} style={{
                border: "1px solid rgba(23,32,51,0.12)", cursor: "pointer",
                background: "white", color: "#64748b",
                padding: "14px 14px", borderRadius: 16, fontWeight: 800, fontSize: 15,
              }}>
                ↺ {isEnglish ? "Retake" : "फिर खींचो"}
              </button>
              <button onClick={submit} style={{
                border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                color: "white", padding: "14px 14px", borderRadius: 16,
                fontWeight: 900, fontSize: 15,
                boxShadow: "0 8px 20px rgba(124,58,237,0.25)",
              }}>
                ✓ {isEnglish ? "Check it!" : "वाणी को दो!"}
              </button>
            </div>
          </>
        )}

        {/* ── ANALYZING: Vaani thinking ── */}
        {camState === "analyzing" && (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <div style={{
              fontSize: 52, marginBottom: 14,
              display: "inline-block", animation: "vcam-spin 1.2s linear infinite",
            }}>🔍</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#7c3aed", marginBottom: 6 }}>
              {isEnglish ? "Vaani is checking…" : "वाणी देख रही है…"}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 700 }}>
              {isEnglish ? "AI is reading your letter" : "AI आपके अक्षर को पढ़ रही है"}
            </div>
          </div>
        )}

        {/* ── RESULT: feedback card ── */}
        {camState === "result" && scanResult && (() => {
          const qc = QUALITY_STYLE[scanResult.quality] ?? QUALITY_STYLE.good;
          const qualityLabel = scanResult.quality === "excellent"
            ? (isEnglish ? "Excellent!" : "बहुत बढ़िया!")
            : scanResult.quality === "good"
            ? (isEnglish ? "Good job!" : "अच्छा!")
            : (isEnglish ? "Keep practising!" : "अभ्यास जारी रखो!");

          return (
            <>
              {capturedDataUrl && (
                <img
                  src={capturedDataUrl}
                  alt="Your handwriting"
                  style={{
                    width: "100%", borderRadius: 20, marginBottom: 14, display: "block",
                    border: `3px solid ${qc.border}`,
                  }}
                />
              )}

              <div style={{
                background: qc.bg, borderRadius: 20, padding: "18px 20px",
                border: `2px solid ${qc.border}`, marginBottom: 16,
              }}>
                <div style={{ fontSize: 30, marginBottom: 6 }}>{qc.stars}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: qc.text, marginBottom: 8 }}>
                  {qualityLabel}
                </div>
                <div style={{ fontSize: 14, color: "#172033", fontWeight: 700, lineHeight: 1.6 }}>
                  {scanResult.feedback}
                </div>
                {scanResult.tip && (
                  <div style={{
                    marginTop: 10, padding: "8px 12px", borderRadius: 11,
                    background: "rgba(255,255,255,0.65)",
                    fontSize: 12, color: "#64748b", fontWeight: 700, lineHeight: 1.5,
                  }}>
                    💡 {scanResult.tip}
                  </div>
                )}
              </div>

              <button onClick={onClose} style={{
                width: "100%", border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white", padding: "16px 22px", borderRadius: 18,
                fontWeight: 900, fontSize: 17,
                boxShadow: "0 10px 24px rgba(16,185,129,0.26)",
              }}>
                {isEnglish ? "Continue learning! →" : "आगे बढ़ते हैं! →"}
              </button>
            </>
          );
        })()}

        {/* Hidden canvas used for screenshot capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <style>{`
        @keyframes vcam-in {
          0%   { transform: scale(0.72); opacity: 0; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes vcam-spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
