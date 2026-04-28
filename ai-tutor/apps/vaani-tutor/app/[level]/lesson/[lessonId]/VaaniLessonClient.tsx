"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { VaaniLessonPayload } from "@/lib/VaaniData";
import VaaniAvatar from "./VaaniAvatar";
import VaaniTraceCanvas from "@/components/Vaani/VaaniTraceCanvas";
import VaaniSpeakCheck from "@/components/Vaani/VaaniSpeakCheck";
import VaaniCameraCapture from "@/components/Vaani/VaaniCameraCapture";
import { getVaaniAudio } from "@/lib/vaaniAudioMapping";
import { startVaaniMusic, type MusicController } from "@/lib/vaaniMusic";
import { markLearned, getDueForReview, markReviewed } from "@/lib/vaaniSpacedRepetition";

const COLORS = {
  ink: "#172033",
  soft: "#64748b",
  panel: "rgba(255,255,255,0.88)",
  line: "rgba(23,32,51,0.08)",
  orange: "#f97316",
  blue: "#3b82f6",
  green: "#10b981",
  pink: "#ec4899",
};

function BoardPanel({ step, boardKey, onTraceComplete }: { step: any; boardKey: number; onTraceComplete?: () => void }) {
  const { data, type } = step.board;
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    setFlippedCards({});
    setSelectedOption(null);
  }, [boardKey]);

  return (
    <div
      style={{
        background: COLORS.panel,
        borderRadius: 28,
        border: `1px solid ${COLORS.line}`,
        padding: "16px 20px",
        boxShadow: "0 24px 54px rgba(59,130,246,0.08)",
      }}
    >
      <div style={{ fontSize: 11, color: COLORS.orange, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>
        Mission Board
      </div>

      {data.headline && <h2 style={{ fontSize: 26, lineHeight: 1.1, margin: "0 0 8px", fontWeight: 900, color: COLORS.ink }}>{data.headline}</h2>}
      {data.prompt && <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.5, color: COLORS.soft }}>{data.prompt}</p>}

      {data.assetPath && (
        <div
          style={{
            background: "linear-gradient(180deg, #fff7ed, #ffffff)",
            borderRadius: 26,
            padding: 18,
            border: "1px solid rgba(249,115,22,0.14)",
            marginBottom: 22,
          }}
        >
          <img src={data.assetPath.startsWith('/vaani') ? data.assetPath : `/vaani${data.assetPath}`} alt={data.headline || "Lesson visual"} style={{ width: "100%", maxHeight: 360, objectFit: "contain" }} />
        </div>
      )}

      {type === "tracing_canvas" && (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{
            display: "flex", gap: 10, alignItems: "center",
            padding: "10px 14px", borderRadius: 14,
            background: "rgba(59,130,246,0.08)",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.blue }}>Trace and say the sound</div>
              <div style={{ fontSize: 12, color: COLORS.soft }}>Slow tracing builds letter memory.</div>
            </div>
            <div style={{
              minWidth: 52, height: 52, borderRadius: 16,
              background: "white", color: COLORS.orange,
              display: "grid", placeItems: "center",
              fontSize: 26, fontWeight: 900,
              border: "1px solid rgba(23,32,51,0.08)",
            }}>
              {data.expression}
            </div>
          </div>
          <VaaniTraceCanvas char={data.expression || "अ"} color={COLORS.orange} onComplete={onTraceComplete} />
        </div>
      )}

      {type === "flashcards" && data.cards && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {data.cards.map((card: any, index: number) => {
            const flipped = flippedCards[index];
            return (
              <button
                key={`${card.front}-${index}`}
                onClick={() => setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }))}
                style={{
                  height: 180,
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  background: "transparent",
                  perspective: "1000px",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.55s ease",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      borderRadius: 24,
                      background: "linear-gradient(135deg, #fff7ed, #ffffff)",
                      border: "1px solid rgba(249,115,22,0.20)",
                      display: "grid",
                      placeItems: "center",
                      padding: 18,
                      color: COLORS.orange,
                      fontSize: 30,
                      fontWeight: 900,
                    }}
                  >
                    <div>
                      <div>{card.front}</div>
                      <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 800, marginTop: 8 }}>Tap to flip</div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderRadius: 24,
                      background: "linear-gradient(135deg, #dbeafe, #ffffff)",
                      border: "1px solid rgba(59,130,246,0.20)",
                      display: "grid",
                      placeItems: "center",
                      padding: 18,
                      color: COLORS.ink,
                      fontSize: 18,
                      fontWeight: 800,
                      lineHeight: 1.4,
                    }}
                  >
                    {card.back}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {type === "mcq" && data.options && (
        <div style={{ display: "grid", gap: 14 }}>
          {data.options.map((option: string) => {
            const selected = option === selectedOption;
            const correct = selected && option === data.answer;
            const wrong = selected && option !== data.answer;
            return (
              <button
                key={option}
                onClick={() => setSelectedOption(option)}
                style={{
                  padding: "18px 20px",
                  borderRadius: 20,
                  cursor: "pointer",
                  border: correct
                    ? "2px solid rgba(16,185,129,0.42)"
                    : wrong
                      ? "2px solid rgba(239,68,68,0.38)"
                      : selected
                        ? "2px solid rgba(59,130,246,0.34)"
                        : `1px solid ${COLORS.line}`,
                  background: correct ? "rgba(16,185,129,0.10)" : wrong ? "rgba(239,68,68,0.08)" : "white",
                  color: COLORS.ink,
                  fontWeight: 800,
                  fontSize: 17,
                  textAlign: "left",
                }}
              >
                {option}
                {correct ? "  ✓" : wrong ? "  ✕" : ""}
              </button>
            );
          })}
        </div>
      )}

      {type === "matchingPairs" && data.pairs && (
        <div style={{ display: "grid", gap: 10 }}>
          {data.pairs.map((pair: any) => (
            <div
              key={`${pair.left}-${pair.right}`}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 14,
                alignItems: "center",
                padding: "16px 18px",
                borderRadius: 20,
                background: "white",
                border: `1px solid ${COLORS.line}`,
              }}
            >
              <div style={{ fontWeight: 900, color: COLORS.orange, fontSize: 24 }}>{pair.left}</div>
              <div style={{ color: COLORS.ink, fontWeight: 700 }}>{pair.right}</div>
            </div>
          ))}
        </div>
      )}

      {type === "video_player" && data.videoUrl && (
        <div style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 24, background: "#0f172a" }}>
          <iframe
            width="100%"
            height="100%"
            src={data.videoUrl.replace("youtu.be/", "www.youtube.com/embed/")}
            title={data.headline || "Lesson video"}
            allowFullScreen
            style={{ border: 0 }}
          />
        </div>
      )}
    </div>
  );
}

export default function VaaniLessonClient({ payload }: { payload: VaaniLessonPayload }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [boardKey, setBoardKey] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [studentName, setStudentName] = useState("Friend");
  const [nameInput, setNameInput] = useState("");
  const [nameAsked, setNameAsked] = useState(false);
  const [fruitPopup, setFruitPopup] = useState(false);
  const [fruitLiked, setFruitLiked] = useState<boolean | null>(null);
  const [hindiLevel, setHindiLevel] = useState<"native" | "some" | "beginner" | "zero">("beginner");
  // Music
  const [musicOn, setMusicOn] = useState(true);
  const musicRef = useRef<MusicController | null>(null);
  // Voice check — shown after tracing / MCQ
  const [voiceCheckVisible, setVoiceCheckVisible] = useState(false);
  const [voiceCheckPassed, setVoiceCheckPassed] = useState(false);
  // Camera scan — optional handwriting check after tracing
  const [showCamera, setShowCamera] = useState(false);
  const [cameraUsed, setCameraUsed] = useState(false);
  // Spaced repetition review
  const [reviewQueue, setReviewQueue] = useState<ReturnType<typeof getDueForReview>>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  // Derive lesson index from lessonId for spaced repetition scheduling
  const lessonIndex = (() => {
    try { return parseInt((payload.lesson as any).id?.replace(/\D/g, "").slice(-3) || "0", 10); }
    catch { return 0; }
  })();

  const lessonChar = (payload.lesson as any).char || "अ";
  const lessonWord = (payload.lesson as any).wordHindi || "अनार";
  const lessonWordEng = (payload.lesson as any).wordEnglish || "Pomegranate";

  // Read student name + Hindi level from parent registration (localStorage)
  useEffect(() => {
    const saved =
      localStorage.getItem("vaani_student_name") ||
      localStorage.getItem("studentName") ||
      localStorage.getItem("child_name") ||
      localStorage.getItem("childName") ||
      null;
    if (saved && saved.trim()) {
      setStudentName(saved.trim());
      setNameAsked(true);
    }
    const level = localStorage.getItem("vaani_hindi_level") as "native" | "some" | "beginner" | "zero" | null;
    if (level) setHindiLevel(level);
  }, []);

  const currentStep = payload.steps[stepIndex] ?? payload.steps[0];
  const progressPct = payload.steps.length ? Math.round(((stepIndex + 1) / payload.steps.length) * 100) : 0;
  const nextLessonUrl = payload.nextLessonUrl || `/${payload.course.levelSlug}`;

  async function speakText(text: string) {
    if (!text) return;
    if (activeAudioRef.current) { activeAudioRef.current.pause(); activeAudioRef.current = null; }

    const nativeUrl = getVaaniAudio(text.trim());
    if (nativeUrl) {
      const audio = new Audio(nativeUrl);
      activeAudioRef.current = audio;
      setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.play().catch(() => setIsSpeaking(false));
      return;
    }

    setIsSpeaking(true);
    try {
      // ✅ Fix: include /vaani basePath prefix
      const resp = await fetch("/vaani/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, avatarId: "priya", provider: "edge" }),
      });
      const data = await resp.json();
      if (data.audioBase64) {
        // ✅ Fix: use actual mimeType from response, not hardcoded wav
        const mime = data.mimeType || "audio/mpeg";
        const audio = new Audio(`data:${mime};base64,${data.audioBase64}`);
        activeAudioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch {
      setIsSpeaking(false);
    }
  }

  // Speak single letter 3 times with pause (uses pre-recorded audio from learning-hindi.com)
  async function speakLetterThrice(char: string) {
    const url = getVaaniAudio(char);
    if (!url) { void speakText(char); return; }
    setIsSpeaking(true);
    for (let i = 0; i < 3; i++) {
      if (i > 0) await new Promise(r => setTimeout(r, 700));
      await new Promise<void>((resolve) => {
        const audio = new Audio(url);
        activeAudioRef.current = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
    }
    setIsSpeaking(false);
  }

  // Adapt Vaani's language mix based on parent-set Hindi fluency level
  function vaaniSay(
    native: string,
    some: string,
    beginner: string,
    zero: string,
  ): string {
    return hindiLevel === "native" ? native
      : hindiLevel === "some" ? some
      : hindiLevel === "beginner" ? beginner
      : zero;
  }

  // Web Audio chime — plays a happy 4-note ascending chord
  function playSuccessChime() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine"; osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.13;
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.start(t); osc.stop(t + 0.55);
      });
    } catch { /* ignore if AudioContext unavailable */ }
  }

  // Auto-speak welcome when landing page mounts (after name is known)
  useEffect(() => {
    if (!nameAsked) return; // wait until we know the name
    const t = setTimeout(() => {
      const msg = vaaniSay(
        `नमस्ते ${studentName}! मैं वाणी हूँ! आज हम ${lessonChar} सीखेंगे — ${lessonWord} जैसे!`,
        `नमस्ते ${studentName}! I am Vaani! Today we learn ${lessonChar} — like in ${lessonWord}!`,
        `Hello ${studentName}! I am Vaani! Today's letter is ${lessonChar} — it says the sound 'a', like in ${lessonWordEng}!`,
        `Hello ${studentName}! I am Vaani, your Hindi teacher! Today we learn the letter ${lessonChar}. It makes the sound 'a' — like in ${lessonWordEng}!`,
      );
      void speakText(msg);
    }, 900);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameAsked, studentName, hindiLevel]);

  // Start background music when session becomes active
  useEffect(() => {
    if (!sessionActive) return;
    const mc = startVaaniMusic(musicOn);
    musicRef.current = mc;
    return () => { mc.stop(); musicRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionActive]);

  // Duck music while Vaani is speaking, restore after
  useEffect(() => {
    if (!musicRef.current) return;
    if (isSpeaking) musicRef.current.duck();
    else musicRef.current.unduck();
  }, [isSpeaking]);

  // Check for spaced repetition reviews when lesson loads
  useEffect(() => {
    const due = getDueForReview(lessonIndex);
    if (due.length > 0) {
      setReviewQueue(due);
      setReviewIndex(0);
      setShowReview(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset voice check + camera invite when step changes
  useEffect(() => {
    setVoiceCheckVisible(false);
    setVoiceCheckPassed(false);
    setShowCamera(false);
    setCameraUsed(false);
  }, [stepIndex]);

  // Speak lesson step when session starts
  useEffect(() => {
    if (sessionActive && currentStep) {
      setBoardKey((value) => value + 1);
      void speakText(currentStep.tutorText);
    }
  }, [currentStep, sessionActive]);

  // ── STAR CELEBRATION ──────────────────────────────────────────────
  if (lessonComplete) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, rgba(249,115,22,0.20), transparent 22%), radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 22%), linear-gradient(180deg, #fff8ef 0%, #ffffff 42%, #f5fbff 100%)",
        fontFamily: "'Outfit', 'Trebuchet MS', sans-serif",
        display: "grid", placeItems: "center", padding: 24,
      }}>
        <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 88, lineHeight: 1, marginBottom: 12, animation: "vn-bounce 0.7s ease-in-out" }}>⭐⭐⭐</div>
          <h1 style={{ fontSize: 54, fontWeight: 900, color: COLORS.ink, margin: "0 0 10px", letterSpacing: -2 }}>
            शाबाश, {studentName}! 🎉
          </h1>
          <div style={{ fontSize: 20, color: COLORS.soft, marginBottom: 6, fontWeight: 700 }}>
            Amazing! You learned the letter
          </div>
          <div style={{
            fontSize: 96, fontWeight: 900, lineHeight: 1,
            background: "linear-gradient(135deg, #f97316, #ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}>
            {lessonChar}
          </div>
          <div style={{ fontSize: 20, color: COLORS.soft, marginBottom: 32 }}>
            {lessonChar} for {lessonWord} &nbsp;·&nbsp; {lessonWordEng}
          </div>

          <div style={{
            background: "rgba(16,185,129,0.10)", borderRadius: 24, padding: "20px 28px",
            border: "2px solid #10b981", marginBottom: 32, display: "grid", gap: 10,
          }}>
            <div style={{ fontSize: 11, color: "#047857", fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.4 }}>
              You can now
            </div>
            {["Say " + lessonChar + " out loud", "Write " + lessonChar + " by tracing", "Remember " + lessonWord].map((item) => (
              <div key={item} style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 700, fontSize: 16, color: COLORS.ink }}>
                <span style={{ color: "#10b981", fontSize: 18 }}>✓</span> {item}
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push(nextLessonUrl)}
            style={{
              border: "none", cursor: "pointer", color: "white",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              padding: "18px 40px", borderRadius: 20, fontWeight: 900, fontSize: 20,
              boxShadow: "0 16px 32px rgba(249,115,22,0.28)", width: "100%",
            }}
          >
            Next Letter →
          </button>
        </div>
        <style>{`
          @keyframes vn-bounce {
            0% { transform: scale(0.5); opacity: 0; }
            60% { transform: scale(1.15); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(249,115,22,0.20), transparent 22%), radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 22%), linear-gradient(180deg, #fff8ef 0%, #ffffff 42%, #f5fbff 100%)",
        color: COLORS.ink,
        fontFamily: "'Outfit', 'Trebuchet MS', sans-serif",
      }}
    >
      <header
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${COLORS.line}`,
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(14px)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: COLORS.orange, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 6 }}>
              Level 1 Lesson
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1 }}>{payload.lesson.title}</div>
          </div>
          <Link
            href={`/${payload.course.levelSlug}`}
            style={{
              textDecoration: "none",
              color: COLORS.blue,
              border: "1px solid rgba(59,130,246,0.18)",
              background: "rgba(59,130,246,0.08)",
              padding: "12px 16px",
              borderRadius: 16,
              fontWeight: 800,
            }}
          >
            Back to level
          </Link>
        </div>
      </header>

      {!sessionActive ? (
        <section style={{ minHeight: "calc(100vh - 88px)", display: "grid", placeItems: "center", padding: 24 }}>
          <div style={{ maxWidth: 980, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>

            {/* LEFT — Vaani teacher with conversational rapport-building */}
            <div style={{
              background: COLORS.panel, borderRadius: 34, border: `1px solid ${COLORS.line}`,
              padding: "28px 24px", boxShadow: "0 26px 58px rgba(15,23,42,0.08)",
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
            }}>
              <VaaniAvatar speaking={isSpeaking} size={120} name="Vaani" />

              {/* Vaani speech bubble — changes with conversation state */}
              <div style={{
                background: "linear-gradient(135deg, #fff7ed, #fef3e2)",
                borderRadius: "16px 16px 16px 4px",
                padding: "13px 16px", marginBottom: 18, marginTop: 4,
                border: "1px solid rgba(249,115,22,0.26)",
                width: "100%", textAlign: "left",
                boxShadow: "0 4px 14px rgba(249,115,22,0.10)",
              }}>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.ink, fontWeight: 700 }}>
                  {!nameAsked
                    ? "नमस्ते! मेरा नाम वाणी है 🙏 What is your name? / आपका नाम क्या है?"
                    : fruitLiked === true
                      ? vaaniSay(
                          `वाह ${studentName}! ${lessonWord} तुम्हारा favourite! चलो ${lessonChar} लिखते हैं! 🎉`,
                          `वाह ${studentName}! You love ${lessonWord}! चलो ${lessonChar} सीखते हैं! 🎉`,
                          `Yay ${studentName}! You love ${lessonWordEng}! Now let's learn ${lessonChar}! 🎉`,
                          `That's great ${studentName}! ${lessonWordEng} is delicious! The letter ${lessonChar} starts this word! Let's learn it! 🎉`,
                        )
                      : fruitLiked === false
                        ? vaaniSay(
                            `कोई बात नहीं ${studentName}! एक दिन ज़रूर खाना! चलो ${lessonChar} सीखते हैं! 🍎`,
                            `No worries ${studentName}! Maybe try ${lessonWord} someday! चलो ${lessonChar} सीखते हैं! 🍎`,
                            `No worries! Maybe try ${lessonWordEng} someday! Now let's learn letter ${lessonChar}! 🍎`,
                            `That's okay ${studentName}! ${lessonWordEng} is a yummy fruit — try it someday! Now, let's learn the letter ${lessonChar}! 🍎`,
                          )
                        : vaaniSay(
                            `नमस्ते ${studentName}! आज हम ${lessonChar} सीखेंगे — जैसे ${lessonWord}! नीचे का अक्षर दबाओ! 🎵`,
                            `नमस्ते ${studentName}! Today we learn ${lessonChar} — like in ${lessonWord}! Tap the letter below! 🎵`,
                            `Hello ${studentName}! Today's letter is ${lessonChar} — it's in the word ${lessonWordEng}! Tap it below! 🎵`,
                            `Hi ${studentName}! I'm Vaani! Today we learn the Hindi letter ${lessonChar}. It sounds like 'a' in ${lessonWordEng}! Tap it below! 🎵`,
                          )
                  }
                </div>
              </div>

              {/* Step 1 — Ask name (shown only when no saved name) */}
              {!nameAsked && (
                <div style={{ width: "100%", marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="अपना नाम लिखो यहाँ..."
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && nameInput.trim()) {
                        const n = nameInput.trim();
                        setStudentName(n);
                        localStorage.setItem("vaani_student_name", n);
                        setNameAsked(true);
                        void speakText(`नमस्ते ${n}! बहुत अच्छा नाम है! आज हम ${lessonChar} सीखेंगे — जैसे ${lessonWord}!`);
                      }
                    }}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      padding: "14px 16px", borderRadius: 16,
                      border: "2px solid rgba(249,115,22,0.40)",
                      fontSize: 18, fontWeight: 700, color: COLORS.ink,
                      background: "white", outline: "none",
                      marginBottom: 10, textAlign: "center",
                    }}
                  />
                  <button
                    disabled={!nameInput.trim()}
                    onClick={() => {
                      const n = nameInput.trim();
                      if (!n) return;
                      setStudentName(n);
                      localStorage.setItem("vaani_student_name", n);
                      setNameAsked(true);
                      void speakText(`नमस्ते ${n}! बहुत अच्छा नाम है! आज हम ${lessonChar} सीखेंगे — जैसे ${lessonWord}!`);
                    }}
                    style={{
                      width: "100%", border: "none",
                      cursor: nameInput.trim() ? "pointer" : "not-allowed",
                      background: nameInput.trim()
                        ? "linear-gradient(135deg, #f97316, #ec4899)"
                        : "rgba(23,32,51,0.10)",
                      color: nameInput.trim() ? "white" : COLORS.soft,
                      padding: "14px 22px", borderRadius: 16, fontWeight: 900, fontSize: 17,
                      transition: "all 0.2s ease",
                    }}
                  >
                    Hello, Vaani! 👋
                  </button>
                </div>
              )}

              {/* Step 2+ — Giant tappable letter + start button */}
              {nameAsked && (
                <>
                  {/* Giant tappable letter — tap = hear 3x + fruit popup */}
                  <button
                    onClick={() => { void speakLetterThrice(lessonChar); setFruitPopup(true); }}
                    title="Tap to hear!"
                    style={{
                      background: "none", border: "none", cursor: "pointer", padding: "4px 16px",
                      fontSize: 118, fontWeight: 900, lineHeight: 1.05,
                      backgroundImage: "linear-gradient(135deg, #f97316, #ec4899)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      transition: "transform 0.12s ease",
                      display: "block",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {lessonChar}
                  </button>

                  <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 700, marginBottom: 12 }}>
                    👆 Tap to hear the letter 3 times!
                  </div>

                  <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.ink, marginBottom: 4 }}>
                    {lessonChar} for {lessonWord}
                  </div>
                  <div style={{ fontSize: 14, color: COLORS.soft, marginBottom: 24 }}>
                    ({lessonWordEng})
                  </div>

                  <button
                    onClick={() => setSessionActive(true)}
                    style={{
                      width: "100%", border: "none", cursor: "pointer", color: "white",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      padding: "18px 22px", borderRadius: 20, fontWeight: 900, fontSize: 21,
                      boxShadow: "0 18px 36px rgba(16,185,129,0.32)",
                      animation: "vn-pulse 2.2s ease-in-out infinite",
                    }}
                  >
                    I'm ready! Let's go 🚀
                  </button>
                </>
              )}
            </div>

            {/* RIGHT — Big Gemini lesson image */}
            <div style={{
              background: "linear-gradient(180deg, #fff7ed, #ffffff)",
              borderRadius: 34, border: "1px solid rgba(249,115,22,0.18)",
              padding: 26, boxShadow: "0 26px 58px rgba(249,115,22,0.08)",
              display: "grid", placeItems: "center", height: "100%", minHeight: 460,
            }}>
              {payload.steps[0]?.board?.data?.assetPath && (
                <img
                  src={payload.steps[0].board.data.assetPath.startsWith("/vaani") ? payload.steps[0].board.data.assetPath : `/vaani${payload.steps[0].board.data.assetPath}`}
                  alt={payload.lesson.title}
                  style={{ width: "100%", maxHeight: 420, objectFit: "contain" }}
                />
              )}
            </div>
          </div>

          <style>{`
            @keyframes vn-pulse {
              0%, 100% { box-shadow: 0 18px 36px rgba(16,185,129,0.32); transform: scale(1); }
              50% { box-shadow: 0 24px 48px rgba(16,185,129,0.48); transform: scale(1.018); }
            }
          `}</style>

          {/* ── FRUIT POPUP — Vaani asks "क्या तुमने खाया है?" ── */}
          {fruitPopup && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(15,23,42,0.60)", backdropFilter: "blur(7px)",
              display: "grid", placeItems: "center", padding: 24,
            }}>
              <div style={{
                background: "white", borderRadius: 36, padding: "36px 28px",
                maxWidth: 400, width: "100%", textAlign: "center",
                boxShadow: "0 40px 80px rgba(15,23,42,0.28)",
                animation: "vn-bounce 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                {/* Vaani mini avatar in popup */}
                <div style={{ fontSize: 72, marginBottom: 4, lineHeight: 1 }}>
                  {lessonWordEng.toLowerCase().includes("mango") ? "🥭"
                    : lessonWordEng.toLowerCase().includes("apple") ? "🍎"
                    : lessonWordEng.toLowerCase().includes("banana") ? "🍌"
                    : lessonWordEng.toLowerCase().includes("grape") ? "🍇"
                    : lessonWordEng.toLowerCase().includes("orange") ? "🍊"
                    : "🍎"}
                </div>

                {/* Vaani speech bubble inside popup */}
                <div style={{
                  background: "linear-gradient(135deg, #fff7ed, #fef3e2)",
                  borderRadius: 16, padding: "12px 16px", marginBottom: 18,
                  border: "1px solid rgba(249,115,22,0.24)", textAlign: "left",
                }}>
                  <div style={{ fontSize: 13, color: COLORS.soft, fontWeight: 800, marginBottom: 4 }}>
                    🎙️ वाणी कह रही है...
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, lineHeight: 1.55 }}>
                    {studentName}, क्या तुमने कभी <strong style={{ color: COLORS.orange }}>{lessonWord}</strong> ({lessonWordEng}) खाया है?
                    यह फल <strong>{lessonChar}</strong> से शुरू होता है! 🌟
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  <button
                    onClick={() => {
                      setFruitLiked(true);
                      setFruitPopup(false);
                      void speakText(`वाह ${studentName}! ${lessonWord} बहुत मज़ेदार है! और देखो — ${lessonChar} से ${lessonWord}! चलो मिलकर ${lessonChar} सीखते हैं!`);
                    }}
                    style={{
                      border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white", padding: "16px 20px", borderRadius: 20,
                      fontWeight: 900, fontSize: 18,
                      boxShadow: "0 8px 20px rgba(16,185,129,0.30)",
                    }}
                  >
                    हाँ! मुझे पसंद है 😍
                  </button>
                  <button
                    onClick={() => {
                      setFruitLiked(false);
                      setFruitPopup(false);
                      void speakText(`कोई बात नहीं ${studentName}! ${lessonWord} एक बहुत अच्छा फल है। एक दिन ज़रूर खाना! अभी चलो ${lessonChar} सीखते हैं!`);
                    }}
                    style={{
                      border: "2px solid rgba(23,32,51,0.12)", cursor: "pointer",
                      background: "white", color: COLORS.ink,
                      padding: "16px 20px", borderRadius: 20,
                      fontWeight: 800, fontSize: 18,
                    }}
                  >
                    नहीं खाया अभी तक 🤔
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
        <section style={{ maxWidth: 1320, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "340px 1fr", gap: 22 }}>
          <aside
            style={{
              background: COLORS.panel,
              borderRadius: 30,
              border: `1px solid ${COLORS.line}`,
              padding: 22,
              boxShadow: "0 20px 48px rgba(15,23,42,0.07)",
              height: "fit-content",
              position: "sticky",
              top: 108,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 8 }}>
                Lesson progress
              </div>
              <div style={{ height: 10, borderRadius: 999, background: "rgba(23,32,51,0.08)", overflow: "hidden", marginBottom: 8 }}>
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #f97316, #ec4899, #3b82f6)",
                    borderRadius: 999,
                  }}
                />
              </div>
              <div style={{ fontSize: 14, color: COLORS.soft, fontWeight: 700 }}>
                Step {stepIndex + 1} of {payload.steps.length}
              </div>
            </div>

            <div style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.08), rgba(255,255,255,0.4))", borderRadius: 26, padding: 10, marginBottom: 16 }}>
              <VaaniAvatar speaking={isSpeaking} size={160} />
              <button
                onClick={() => currentStep && speakText(currentStep.tutorText)}
                style={{
                  marginTop: 8,
                  width: "100%",
                  border: "none",
                  cursor: "pointer",
                  background: "white",
                  color: COLORS.blue,
                  padding: "12px 16px",
                  borderRadius: 16,
                  fontWeight: 800,
                }}
              >
                Replay coach audio
              </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {payload.steps.map((step, index) => {
                const active = stepIndex === index;
                return (
                  <button
                    key={step.id}
                    onClick={() => setStepIndex(index)}
                    style={{
                      textAlign: "left",
                      borderRadius: 18,
                      padding: "14px 16px",
                      cursor: "pointer",
                      border: active ? "2px solid rgba(249,115,22,0.26)" : `1px solid ${COLORS.line}`,
                      background: active ? "rgba(249,115,22,0.10)" : "white",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 12,
                          display: "grid",
                          placeItems: "center",
                          background: active ? "linear-gradient(135deg, #f97316, #ef4444)" : "rgba(59,130,246,0.12)",
                          color: active ? "white" : COLORS.blue,
                          fontWeight: 900,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: COLORS.ink }}>{step.label}</div>
                        <div style={{ fontSize: 12, color: COLORS.soft }}>{step.skillTags.join(" · ")}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.10), rgba(59,130,246,0.06))",
                borderRadius: 20,
                padding: "12px 16px",
                border: "1px solid rgba(249,115,22,0.12)",
              }}
            >
              <div style={{ fontSize: 11, color: COLORS.orange, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 4 }}>
                Coach says
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.5, color: COLORS.ink, fontWeight: 700 }}>{currentStep?.tutorText}</div>
              {/* English subtitle for beginners/zero Hindi kids */}
              {(hindiLevel === "zero" || hindiLevel === "beginner") && (
                <div style={{
                  marginTop: 10, padding: "8px 14px", borderRadius: 12,
                  background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.14)",
                  fontSize: 14, color: COLORS.soft, fontWeight: 700, fontStyle: "italic",
                }}>
                  💡 {hindiLevel === "zero"
                    ? `Listen to Vaani say the letter ${lessonChar}! Repeat after her!`
                    : `सुनो और बोलो — Listen and repeat the letter ${lessonChar}!`}
                </div>
              )}
            </div>

            {currentStep && (
              <BoardPanel
                step={currentStep}
                boardKey={boardKey}
                onTraceComplete={() => {
                  playSuccessChime();
                  void speakText(vaaniSay(
                    `बहुत बढ़िया! अब बोलो ${studentName}: ${lessonWord}!`,
                    `Great! Now say it ${studentName}: ${lessonWord}!`,
                    `Well done! Now say the word: ${lessonWordEng}!`,
                    `Wonderful! Now say: ${lessonWordEng}!`,
                  ));
                  setVoiceCheckVisible(true);
                }}
              />
            )}

            {/* ── VOICE CHECK — appears after tracing ── */}
            {voiceCheckVisible && !voiceCheckPassed && (
              <VaaniSpeakCheck
                targetChar={lessonChar}
                targetWord={lessonWord}
                targetWordEng={lessonWordEng}
                prompt={vaaniSay(
                  `अब बोलो मेरे साथ: ${lessonWord}! 🎙️`,
                  `Now say it with me: ${lessonWord}! 🎙️`,
                  `Now say: "${lessonWordEng}"! Can you? 🎙️`,
                  `Your turn! Say: "${lessonWordEng}"! 🎙️`,
                )}
                studentName={studentName}
                hindiLevel={hindiLevel}
                onPass={(correct) => {
                  setVoiceCheckPassed(true);
                  setVoiceCheckVisible(false);
                  if (correct) playSuccessChime();
                }}
                onSpeak={speakText}
                autoStart
              />
            )}

            {voiceCheckPassed && (
              <div style={{
                background: "rgba(16,185,129,0.10)", borderRadius: 18,
                padding: "12px 18px", border: "1px solid rgba(16,185,129,0.30)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#047857" }}>
                  {vaaniSay("बहुत बढ़िया! अगले कदम पर चलो →", "Great job! Move to next step →", "Well said! Next step →", "Excellent! Move on →")}
                </span>
              </div>
            )}

            {/* ── CAMERA INVITE — shown after voice check passes, on tracing steps ── */}
            {voiceCheckPassed && !cameraUsed && currentStep?.board?.type === "tracing_canvas" && (
              <div style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.06))",
                borderRadius: 20, padding: "16px 18px",
                border: "1px solid rgba(124,58,237,0.22)",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 28 }}>📝</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#7c3aed", marginBottom: 2 }}>
                    {vaaniSay(
                      `${lessonChar} कागज़ पर भी लिखो!`,
                      `Try writing ${lessonChar} on paper too!`,
                      `Now write "${lessonChar}" on real paper!`,
                      `Write "${lessonChar}" on paper — show Vaani!`,
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>
                    {vaaniSay(
                      "कागज़ पर लिखो और camera से scan करो",
                      "Write it and scan — Vaani gives feedback!",
                      "Scan your writing — get AI feedback!",
                      "Camera scans your real handwriting!",
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCamera(true);
                    void speakText(vaaniSay(
                      `${lessonChar} कागज़ पर लिखो और मुझे दिखाओ ${studentName}!`,
                      `Write ${lessonChar} on paper and show me ${studentName}!`,
                      `Write "${lessonChar}" on paper and scan it ${studentName}!`,
                      `Write the letter "${lessonChar}" on paper and show the camera, ${studentName}!`,
                    ));
                  }}
                  style={{
                    border: "none", cursor: "pointer", flexShrink: 0,
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                    color: "white", padding: "12px 16px", borderRadius: 14,
                    fontWeight: 900, fontSize: 13,
                    boxShadow: "0 6px 16px rgba(124,58,237,0.25)",
                    whiteSpace: "nowrap",
                  }}
                >
                  📷 Scan!
                </button>
              </div>
            )}

          </div>
        </section>

        {/* ── CAMERA SCAN MODAL ── */}
        {showCamera && (
          <VaaniCameraCapture
            targetChar={lessonChar}
            studentName={studentName}
            hindiLevel={hindiLevel}
            onSpeak={speakText}
            onResult={(result) => {
              setCameraUsed(true);
              // Extra chime for excellent scans
              if (result.quality === "excellent") playSuccessChime();
            }}
            onClose={() => {
              setShowCamera(false);
              setCameraUsed(true);
            }}
          />
        )}

        {/* ── SPACED REPETITION REVIEW MODAL ── */}
        {showReview && reviewQueue.length > 0 && reviewIndex < reviewQueue.length && (() => {
          const item = reviewQueue[reviewIndex];
          return (
            <div style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)",
              display: "grid", placeItems: "center", padding: 24,
            }}>
              <div style={{
                background: "white", borderRadius: 36, padding: "32px 28px",
                maxWidth: 420, width: "100%", textAlign: "center",
                boxShadow: "0 40px 80px rgba(15,23,42,0.30)",
                animation: "vn-bounce 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 10 }}>
                  🔁 Quick Revision
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#172033", marginBottom: 18, lineHeight: 1.5 }}>
                  {vaaniSay(
                    `${studentName}, याद है यह अक्षर?`,
                    `${studentName}, remember this letter?`,
                    `${studentName}, do you remember this? 🤔`,
                    `${studentName}, can you still remember? 🤔`,
                  )}
                </div>
                <div style={{
                  fontSize: 96, fontWeight: 900, lineHeight: 1, marginBottom: 8,
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  {item.char}
                </div>
                <div style={{ fontSize: 16, color: COLORS.soft, marginBottom: 24 }}>
                  {item.char} for {item.word} ({item.wordEng})
                </div>
                <VaaniSpeakCheck
                  targetChar={item.char}
                  targetWord={item.word}
                  targetWordEng={item.wordEng}
                  prompt={vaaniSay(
                    `बोलो: ${item.word}! 🎙️`,
                    `Say: ${item.word}! 🎙️`,
                    `Say: "${item.wordEng}"! 🎙️`,
                    `Can you say: "${item.wordEng}"? 🎙️`,
                  )}
                  studentName={studentName}
                  hindiLevel={hindiLevel}
                  onPass={(correct) => {
                    markReviewed(item.char, correct, lessonIndex);
                    if (reviewIndex + 1 < reviewQueue.length) {
                      setReviewIndex(i => i + 1);
                    } else {
                      setShowReview(false);
                    }
                  }}
                  onSpeak={speakText}
                  autoStart={false}
                />
                <button
                  onClick={() => setShowReview(false)}
                  style={{
                    marginTop: 16, border: "none", cursor: "pointer",
                    background: "transparent", color: COLORS.soft,
                    fontSize: 13, fontWeight: 700, textDecoration: "underline",
                  }}
                >
                  Skip revision
                </button>
              </div>
            </div>
          );
        })()}

        {/* ── STICKY NAV BAR — always visible at bottom ── */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(23,32,51,0.10)",
          padding: "12px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14,
          boxShadow: "0 -4px 24px rgba(15,23,42,0.08)",
        }}>
          {/* Step indicator + music toggle */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {/* Music mute button */}
            <button
              onClick={() => {
                if (musicRef.current) {
                  const on = musicRef.current.toggle();
                  setMusicOn(on);
                }
              }}
              title={musicOn ? "Mute music" : "Unmute music"}
              style={{
                width: 32, height: 32, borderRadius: 10, border: "none",
                cursor: "pointer", fontSize: 16,
                background: musicOn ? "rgba(249,115,22,0.12)" : "rgba(23,32,51,0.08)",
                marginRight: 4,
              }}
            >
              {musicOn ? "🎵" : "🔇"}
            </button>
            {payload.steps.map((_, i) => (
              <div key={i} style={{
                width: i === stepIndex ? 24 : 8,
                height: 8, borderRadius: 999,
                background: i === stepIndex
                  ? "linear-gradient(90deg, #f97316, #ef4444)"
                  : i < stepIndex ? "#10b981" : "rgba(23,32,51,0.15)",
                transition: "all 0.3s ease",
              }} />
            ))}
            <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.soft, marginLeft: 6 }}>
              Step {stepIndex + 1} / {payload.steps.length}
            </span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((v) => Math.max(0, v - 1))}
              style={{
                border: `1px solid ${COLORS.line}`,
                cursor: stepIndex === 0 ? "not-allowed" : "pointer",
                opacity: stepIndex === 0 ? 0.4 : 1,
                background: "white", color: COLORS.ink,
                padding: "12px 22px", borderRadius: 14, fontWeight: 800, fontSize: 15,
              }}
            >
              ← Back
            </button>

            <button
              onClick={() => {
                if (stepIndex < payload.steps.length - 1) {
                  setStepIndex((v) => v + 1);
                  return;
                }
                void speakText(vaaniSay(
                  `शाबाश ${studentName}! तुमने ${lessonChar} सीख लिया! बहुत बढ़िया!`,
                  `शाबाश ${studentName}! You finished the lesson! बहुत अच्छा!`,
                  `Amazing ${studentName}! You completed the lesson! You learned the letter ${lessonChar}!`,
                  `Wonderful ${studentName}! You finished the lesson! Great job learning the letter ${lessonChar}!`,
                ));
                markLearned(lessonChar, lessonWord, lessonWordEng, lessonIndex);
                musicRef.current?.stop();
                setLessonComplete(true);
              }}
              style={{
                border: "none", cursor: "pointer", color: "white",
                background: stepIndex === payload.steps.length - 1
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #f97316, #ef4444)",
                padding: "12px 28px", borderRadius: 14, fontWeight: 900, fontSize: 15,
                boxShadow: "0 8px 20px rgba(249,115,22,0.22)",
              }}
            >
              {stepIndex === payload.steps.length - 1 ? "🎉 I'm done!" : "Next step →"}
            </button>
          </div>
        </div>

        {/* Spacer so content doesn't hide behind sticky nav */}
        <div style={{ height: 72 }} />
        </>
      )}
    </main>
  );
}
