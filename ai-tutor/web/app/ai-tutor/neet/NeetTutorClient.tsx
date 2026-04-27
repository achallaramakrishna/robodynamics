"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "loading" | "teaching" | "practice" | "error";

interface StepTiming {
  step: number;
  startTime: number;
  narration: string;
}

interface Slide {
  slide: string;
  title: string;
  description: string;
  keyPoints?: string[];
  demoSteps?: string[];
  demoSpeech?: string;
  demoStepTiming?: StepTiming[];
  diagramSrc?: string;
  diagramCaption?: string;
}

interface Lesson {
  code: string;
  title: string;
  slides: Slide[];
}

interface MCQOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface Question {
  questionId: string;
  questionText: string;
  options: MCQOptions;
  correctOption: string;
  explanation: string;
  topic?: string;
  difficulty?: string;
  allOptionExplanations?: Record<string, string>;
  neetYear?: string;
}

interface Feedback {
  isCorrect: boolean;
  correctOption: string;
  selectedOption: string;
  explanation: string;
  allOptionExplanations?: Record<string, string>;
  meeraMessage: string;
  scoreChange: number;
  newScore: number;
  encouragement: string;
  correct: number;
  wrong: number;
}

interface NeetTutorClientProps {
  initialSubject: string;
  initialChapter: string;
  studentClass: string | null;
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

function MeeraAvatar({ size = 80, mood = "teaching", color = "#8B5CF6" }: { size?: number; mood?: string; color?: string }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      border: `3px solid ${color}`,
      boxShadow: `0 0 0 4px ${color}25, 0 0 28px ${color}35`,
      background: "#1E293B",
      flexShrink: 0,
      position: "relative",
    }}>
      <img
        src="/avatars/3.svg"
        alt="MEERA AI Tutor"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => {
          // Fallback if avatar doesn't load
          (e.target as HTMLImageElement).style.display = "none";
          const parent = (e.target as HTMLImageElement).parentElement;
          if (parent) {
            parent.style.background = `linear-gradient(135deg, #6D28D9, #8B5CF6)`;
            parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:${size * 0.4}px;font-weight:900;color:#fff">M</div>`;
          }
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NeetTutorClient({ initialSubject, initialChapter, studentClass }: NeetTutorClientProps) {
  const subject = initialSubject.toLowerCase();
  const chapter = initialChapter;
  const subjectColor = { biology: "#8B5CF6", physics: "#3B82F6", chemistry: "#10B981" }[subject] || "#8B5CF6";

  // Phase & lesson
  const [phase, setPhase] = useState<Phase>("loading");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // TTS / audio
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Practice
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [practiceLoading, setPracticeLoading] = useState(false);

  // ─── Load lesson on mount ─────────────────────────────────────────────────

  useEffect(() => {
    async function loadLesson() {
      try {
        const res = await fetch(`/ai-tutor-api/neet/intro?chapter=${chapter}`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data: Lesson = await res.json();
        if (data && data.slides && data.slides.length > 0) {
          setLesson(data);
          setPhase("teaching");
        } else {
          throw new Error("No slides returned");
        }
      } catch {
        // No lesson intro available — go straight to practice
        setPhase("practice");
        doStartPractice();
      }
    }
    loadLesson();
  }, [chapter]);

  // ─── TTS narration ────────────────────────────────────────────────────────

  const playNarration = useCallback(async (text: string) => {
    if (!text || isLoadingAudio) return;

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioSrc(null);
    setCurrentStep(0);
    setIsLoadingAudio(true);

    try {
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, avatarId: "meera", languageCode: "en-IN" }),
      });
      const data = await res.json();

      if (data.audioBase64) {
        const src = `data:${data.mimeType || "audio/mpeg"};base64,${data.audioBase64}`;
        setAudioSrc(src);
        // isPlaying will be set via the onPlay event
      } else if (data.provider === "browser") {
        // Browser speech synthesis fallback
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-IN";
        utter.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
        setIsPlaying(true);
        utter.onend = () => setIsPlaying(false);
      }
    } catch {
      // Silent fail — TTS is optional
    } finally {
      setIsLoadingAudio(false);
    }
  }, [isLoadingAudio]);

  // Step sync based on audio time
  function handleTimeUpdate(currentTime: number) {
    const demoSlide = lesson?.slides.find((s) => s.demoStepTiming && s.demoStepTiming.length > 0);
    if (!demoSlide?.demoStepTiming) return;
    let active = 0;
    for (const st of demoSlide.demoStepTiming) {
      if (currentTime >= st.startTime) active = st.step;
    }
    setCurrentStep(active);
  }

  // ─── Start Practice ───────────────────────────────────────────────────────

  async function doStartPractice() {
    setPracticeLoading(true);
    try {
      const res = await fetch("/ai-tutor-api/neet/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, chapterCode: chapter, examTarget: "2027" }),
      });
      if (!res.ok) throw new Error(`Start failed: ${res.status}`);
      const data = await res.json();
      setSessionId(data.sessionId);

      // Check if question is a valid MCQ
      const q = data.question;
      const isValidMCQ = q && q.options && typeof q.options === "object" && Object.keys(q.options).length === 4;

      if (isValidMCQ) {
        setQuestion(q as Question);
        setQuestionNum(1);
      } else {
        // Fetch a proper MCQ via next-question
        await doFetchNextQuestion(data.sessionId);
      }
    } catch (err) {
      setErrorMsg(String(err));
      setPhase("error");
    } finally {
      setPracticeLoading(false);
    }
  }

  async function doFetchNextQuestion(sid?: string) {
    const activeSession = sid || sessionId;
    if (!activeSession) return;
    setPracticeLoading(true);
    try {
      const res = await fetch("/ai-tutor-api/neet/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSession, chapterCode: chapter, exerciseGroup: "A" }),
      });
      if (!res.ok) throw new Error(`Next question failed: ${res.status}`);
      const data = await res.json();
      const q = data.question;
      const isValidMCQ = q && q.options && typeof q.options === "object" && Object.keys(q.options).length === 4;
      if (isValidMCQ) {
        setQuestion(q as Question);
        setQuestionNum((n) => n + 1);
        setSelected(null);
        setFeedback(null);
        setAnswered(false);
      } else {
        // Retry once more
        console.warn("Question not valid MCQ:", q);
      }
    } catch (err) {
      console.error("Failed to fetch next question:", err);
    } finally {
      setPracticeLoading(false);
    }
  }

  async function doCheckAnswer() {
    if (!selected || !sessionId || !question || answered) return;
    setPracticeLoading(true);
    try {
      const res = await fetch("/ai-tutor-api/neet/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, questionId: question.questionId, selectedOption: selected }),
      });
      if (!res.ok) throw new Error(`Check answer failed: ${res.status}`);
      const data: Feedback = await res.json();
      setFeedback(data);
      setAnswered(true);
      setScore(data.newScore);
      if (data.isCorrect) setCorrectCount((n) => n + 1);
    } catch (err) {
      console.error("Check answer error:", err);
    } finally {
      setPracticeLoading(false);
    }
  }

  function goToPractice() {
    setPhase("practice");
    if (!sessionId) doStartPractice();
  }

  // ─── Teaching Phase ───────────────────────────────────────────────────────

  function renderTeaching() {
    if (!lesson) return null;
    const demoSlide = lesson.slides.find((s) => s.demoSpeech) || lesson.slides[0];
    const steps = demoSlide?.demoStepTiming || [];
    const activeNarration = steps.find((s) => s.step === currentStep)?.narration;
    const speechPreview = demoSlide?.demoSpeech?.slice(0, 130) + (demoSlide?.demoSpeech && demoSlide.demoSpeech.length > 130 ? "..." : "");

    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* ── LEFT: MEERA Panel ── */}
        <div style={{
          width: 280, minHeight: "100vh", background: "#0A0F1E",
          borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column",
          alignItems: "center", padding: "28px 16px", gap: 16, flexShrink: 0,
        }}>
          <MeeraAvatar size={88} mood="teaching" color={subjectColor} />

          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 18, letterSpacing: 0.3 }}>MEERA</div>
            <div style={{ color: subjectColor, fontSize: 10, fontWeight: 700, letterSpacing: 2, marginTop: 2 }}>AI TUTOR</div>
            <div style={{
              marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 99, padding: "4px 12px",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
              <span style={{ color: "#6EE7B7", fontSize: 11, fontWeight: 700 }}>LIVE TEACHING</span>
            </div>
          </div>

          {/* Speech bubble */}
          <div style={{
            background: "#1E293B", borderRadius: 14, padding: "14px 16px",
            border: `1px solid ${subjectColor}30`, width: "100%",
          }}>
            <div style={{ fontSize: 10, color: subjectColor, fontWeight: 800, marginBottom: 8, letterSpacing: 0.5 }}>
              💬 MEERA SAYS
            </div>
            <p style={{ color: "#CBD5E1", fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              {isPlaying && activeNarration ? activeNarration : speechPreview || "Let's explore this chapter together!"}
            </p>
          </div>

          {/* Play button */}
          <button
            onClick={() => playNarration(demoSlide?.demoSpeech || "")}
            disabled={isLoadingAudio || !demoSlide?.demoSpeech}
            style={{
              width: "100%", padding: "11px 16px", borderRadius: 10, border: "none",
              background: isLoadingAudio
                ? "#334155"
                : isPlaying
                ? `linear-gradient(135deg, #10B981, #059669)`
                : `linear-gradient(135deg, ${subjectColor}, ${subjectColor}BB)`,
              color: "#fff", fontWeight: 700, fontSize: 13,
              cursor: isLoadingAudio ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: isPlaying ? "0 4px 16px rgba(16,185,129,0.35)" : `0 4px 16px ${subjectColor}35`,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 16 }}>
              {isLoadingAudio ? "⏳" : isPlaying ? "🔊" : "▶"}
            </span>
            {isLoadingAudio ? "Loading audio..." : isPlaying ? "Playing..." : "Play Narration"}
          </button>

          {/* Hidden audio */}
          {audioSrc && (
            <audio
              ref={audioRef}
              src={audioSrc}
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onEnded={() => { setIsPlaying(false); setCurrentStep(0); }}
              onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime)}
              style={{ display: "none" }}
            />
          )}

          <div style={{ flex: 1 }} />

          {/* Chapter meta */}
          <div style={{ background: "#1E293B", borderRadius: 12, padding: "12px 14px", border: "1px solid #334155", width: "100%" }}>
            <div style={{ fontSize: 9, color: "#64748B", fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>CHAPTER</div>
            <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 13, lineHeight: 1.3 }}>{lesson.title}</div>
            <div style={{ color: subjectColor, fontSize: 11, fontWeight: 600, textTransform: "capitalize", marginTop: 3 }}>{subject}</div>
          </div>

          {/* CTA */}
          <button
            onClick={goToPractice}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${subjectColor}, ${subjectColor}99)`,
              color: "#fff", fontWeight: 900, fontSize: 14,
              cursor: "pointer", boxShadow: `0 6px 20px ${subjectColor}40`,
              letterSpacing: 0.3,
            }}
          >
            ⚡ Start Practice
          </button>
        </div>

        {/* ── RIGHT: Lesson Content ── */}
        <div style={{ flex: 1, overflowY: "auto", maxHeight: "100vh", padding: "28px 36px" }}>

          {/* Step tracker */}
          {steps.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <span style={{ color: "#64748B", fontSize: 12, fontWeight: 600 }}>Steps</span>
              {steps.map((s) => (
                <div
                  key={s.step}
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: s.step <= currentStep ? subjectColor : "#1E293B",
                    border: `2px solid ${s.step <= currentStep ? subjectColor : "#334155"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, transition: "all 0.4s",
                    color: s.step <= currentStep ? "#fff" : "#475569",
                    boxShadow: s.step === currentStep ? `0 0 10px ${subjectColor}80` : "none",
                  }}
                >
                  {s.step}
                </div>
              ))}
            </div>
          )}

          {/* Active step narration banner */}
          {currentStep > 0 && activeNarration && (
            <div style={{
              background: `${subjectColor}12`, border: `1px solid ${subjectColor}35`,
              borderRadius: 12, padding: "12px 18px", marginBottom: 24,
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 16 }}>🎙</span>
              <div>
                <span style={{ color: subjectColor, fontWeight: 700, fontSize: 11 }}>STEP {currentStep}  </span>
                <span style={{ color: "#CBD5E1", fontSize: 13 }}>{activeNarration}</span>
              </div>
            </div>
          )}

          {/* Title + description */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <span style={{
                background: `${subjectColor}20`, color: subjectColor,
                padding: "4px 12px", borderRadius: 99, fontSize: 11,
                fontWeight: 800, border: `1px solid ${subjectColor}40`,
              }}>
                {subject.toUpperCase()}
              </span>
            </div>
            <h1 style={{ color: "#F8FAFC", fontSize: 28, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.2 }}>
              {demoSlide?.title || lesson.title}
            </h1>
            <p style={{ color: "#94A3B8", fontSize: 15, margin: 0, lineHeight: 1.7 }}>
              {demoSlide?.description}
            </p>
          </div>

          {/* SVG Diagram */}
          {demoSlide?.diagramSrc && (
            <div style={{
              background: "#1E293B", borderRadius: 16, border: "1px solid #334155",
              padding: 24, marginBottom: 24,
            }}>
              <h3 style={{ color: "#CBD5E1", fontSize: 14, fontWeight: 800, margin: "0 0 16px" }}>
                📊 Visual Reference
              </h3>
              <div style={{
                background: "#0F172A", borderRadius: 12, padding: "20px",
                display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220,
              }}>
                <img
                  src={demoSlide.diagramSrc}
                  alt="Lesson Diagram"
                  style={{ maxWidth: "100%", maxHeight: 340, objectFit: "contain" }}
                />
              </div>
              {demoSlide.diagramCaption && (
                <p style={{ color: "#64748B", fontSize: 12, marginTop: 12, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
                  {demoSlide.diagramCaption}
                </p>
              )}
            </div>
          )}

          {/* Key concepts + step-by-step from all slides */}
          {lesson.slides.map((slide, idx) => (
            <React.Fragment key={idx}>
              {slide.keyPoints && slide.keyPoints.length > 0 && (
                <div style={{
                  background: "#1E293B", borderRadius: 16, border: "1px solid #334155",
                  padding: 24, marginBottom: 20,
                }}>
                  <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 900, margin: "0 0 18px" }}>
                    🎯 Key Concepts for NEET
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {slide.keyPoints.map((point, j) => (
                      <div key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: `${subjectColor}20`, border: `1px solid ${subjectColor}60`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 900, color: subjectColor,
                        }}>
                          {j + 1}
                        </div>
                        <span style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.75 }}>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {slide.demoSteps && slide.demoSteps.length > 0 && (
                <div style={{
                  background: "rgba(37,99,235,0.07)", borderRadius: 16,
                  border: "1px solid rgba(59,130,246,0.2)", padding: 24, marginBottom: 20,
                }}>
                  <h3 style={{ color: "#60A5FA", fontSize: 15, fontWeight: 900, margin: "0 0 18px" }}>
                    🔬 Step-by-Step Process
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {slide.demoSteps.map((step, j) => (
                      <div key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 900, color: "#60A5FA",
                        }}>
                          {j + 1}
                        </div>
                        <span style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.75 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Start Practice CTA */}
          <div style={{ paddingTop: 8, paddingBottom: 48, display: "flex", justifyContent: "center" }}>
            <button
              onClick={goToPractice}
              style={{
                padding: "18px 56px", borderRadius: 14, border: "none",
                background: `linear-gradient(135deg, ${subjectColor}, ${subjectColor}99)`,
                color: "#fff", fontWeight: 900, fontSize: 17,
                cursor: "pointer", boxShadow: `0 8px 32px ${subjectColor}40`,
                letterSpacing: 0.5,
              }}
            >
              ⚡ Start Practice Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Practice Phase ───────────────────────────────────────────────────────

  function renderPractice() {
    const accuracy = questionNum > 0 ? Math.round((correctCount / questionNum) * 100) : 0;
    const meeraMsg = feedback?.meeraMessage
      || (selected ? "Good choice! Click 'Check Answer' to see if you're right." : "Choose the best answer from the options below.");

    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* ── LEFT: MEERA Panel ── */}
        <div style={{
          width: 280, minHeight: "100vh", background: "#0A0F1E",
          borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column",
          alignItems: "center", padding: "28px 16px", gap: 16, flexShrink: 0,
        }}>
          <MeeraAvatar
            size={88}
            mood={feedback?.isCorrect ? "celebrating" : answered && feedback && !feedback.isCorrect ? "encouraging" : "thinking"}
            color={subjectColor}
          />

          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 18, letterSpacing: 0.3 }}>MEERA</div>
            <div style={{ color: subjectColor, fontSize: 10, fontWeight: 700, letterSpacing: 2, marginTop: 2 }}>AI TUTOR</div>
          </div>

          {/* Meera's message */}
          <div style={{
            background: "#1E293B", borderRadius: 14, padding: "14px 16px",
            border: `1px solid ${subjectColor}30`, width: "100%",
          }}>
            <div style={{ fontSize: 10, color: subjectColor, fontWeight: 800, marginBottom: 8, letterSpacing: 0.5 }}>
              💬 MEERA SAYS
            </div>
            <p style={{ color: "#CBD5E1", fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              {meeraMsg}
            </p>
          </div>

          {/* Score + Accuracy */}
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <div style={{
              flex: 1, background: "#1E293B", borderRadius: 12, padding: "12px 8px",
              border: "1px solid #334155", textAlign: "center",
            }}>
              <div style={{ color: "#C084FC", fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{score}</div>
              <div style={{ color: "#64748B", fontSize: 9, fontWeight: 700, marginTop: 4 }}>SCORE</div>
            </div>
            <div style={{
              flex: 1, background: "#1E293B", borderRadius: 12, padding: "12px 8px",
              border: "1px solid #334155", textAlign: "center",
            }}>
              <div style={{
                fontWeight: 900, fontSize: 22, lineHeight: 1,
                color: accuracy >= 60 ? "#4ADE80" : "#F87171",
              }}>{accuracy}%</div>
              <div style={{ color: "#64748B", fontSize: 9, fontWeight: 700, marginTop: 4 }}>ACCURACY</div>
            </div>
          </div>

          {/* Question counter */}
          <div style={{
            background: "#1E293B", borderRadius: 12, padding: "10px 14px",
            border: "1px solid #334155", width: "100%", textAlign: "center",
          }}>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 22 }}>Q{questionNum}</div>
            <div style={{ color: "#64748B", fontSize: 10, fontWeight: 700, marginTop: 2 }}>
              {correctCount} correct · {questionNum - correctCount} wrong
            </div>
          </div>

          {/* Chapter info */}
          <div style={{
            background: "#1E293B", borderRadius: 12, padding: "12px 14px",
            border: "1px solid #334155", width: "100%",
          }}>
            <div style={{ fontSize: 9, color: "#64748B", fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>CHAPTER</div>
            <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 12, lineHeight: 1.3 }}>
              {lesson?.title || chapter.replace(/_/g, " ")}
            </div>
            <div style={{ color: subjectColor, fontSize: 11, fontWeight: 600, textTransform: "capitalize", marginTop: 3 }}>
              {subject}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Back to lesson */}
          {lesson && (
            <button
              onClick={() => setPhase("teaching")}
              style={{
                width: "100%", padding: "11px", borderRadius: 10, border: "1px solid #334155",
                background: "#1E293B", color: "#94A3B8", fontWeight: 600, fontSize: 12, cursor: "pointer",
              }}
            >
              ← Review Lesson
            </button>
          )}
        </div>

        {/* ── RIGHT: Question Panel ── */}
        <div style={{ flex: 1, overflowY: "auto", maxHeight: "100vh", padding: "28px 36px" }}>

          {/* Header bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #1E293B",
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{
                background: `${subjectColor}20`, color: subjectColor,
                padding: "5px 14px", borderRadius: 99, fontSize: 11,
                fontWeight: 800, border: `1px solid ${subjectColor}40`,
              }}>
                {subject.toUpperCase()}
              </span>
              <span style={{ color: "#475569", fontSize: 12 }}>•</span>
              <span style={{ color: "#475569", fontSize: 12 }}>{chapter.replace(/_/g, " ")}</span>
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <span style={{ color: "#4ADE80", fontWeight: 700, fontSize: 13 }}>+4 / -1 marking</span>
            </div>
          </div>

          {/* Loading */}
          {practiceLoading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                <p style={{ color: "#64748B", fontSize: 14 }}>Loading question...</p>
              </div>
            </div>
          )}

          {/* No question yet */}
          {!practiceLoading && !question && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
                <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 20 }}>Ready to practice?</p>
                <button
                  onClick={() => doStartPractice()}
                  style={{
                    padding: "14px 32px", borderRadius: 12, border: "none",
                    background: `linear-gradient(135deg, ${subjectColor}, ${subjectColor}CC)`,
                    color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  }}
                >
                  Load Question
                </button>
              </div>
            </div>
          )}

          {/* Question card */}
          {!practiceLoading && question && (
            <>
              <div style={{
                background: "#1E293B", borderRadius: 18, border: "1px solid #334155",
                padding: "32px 36px", marginBottom: 20,
              }}>
                {/* Topic + difficulty */}
                <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                  {question.topic && (
                    <span style={{
                      fontSize: 11, color: "#94A3B8", background: "#0F172A",
                      padding: "3px 12px", borderRadius: 99, border: "1px solid #334155",
                    }}>
                      {question.topic}
                    </span>
                  )}
                  {question.difficulty && (
                    <span style={{
                      fontSize: 11, padding: "3px 12px", borderRadius: 99,
                      background: question.difficulty === "easy"
                        ? "rgba(74,222,128,0.1)" : question.difficulty === "hard"
                        ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)",
                      color: question.difficulty === "easy" ? "#4ADE80" : question.difficulty === "hard" ? "#F87171" : "#FBBF24",
                      border: `1px solid ${question.difficulty === "easy" ? "#4ADE8040" : question.difficulty === "hard" ? "#EF444440" : "#FBBF2440"}`,
                    }}>
                      {question.difficulty}
                    </span>
                  )}
                  {question.neetYear && (
                    <span style={{
                      fontSize: 11, color: "#F59E0B", background: "rgba(245,158,11,0.1)",
                      padding: "3px 12px", borderRadius: 99, border: "1px solid rgba(245,158,11,0.3)",
                    }}>
                      NEET {question.neetYear}
                    </span>
                  )}
                </div>

                {/* Question text */}
                <h2 style={{
                  color: "#F8FAFC", fontSize: 19, fontWeight: 600,
                  lineHeight: 1.65, margin: "0 0 28px",
                }}>
                  {question.questionText}
                </h2>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(["A", "B", "C", "D"] as const).map((key) => {
                    if (!question.options[key]) return null;
                    const isSelected = selected === key;
                    const isCorrectOption = feedback && key === feedback.correctOption;
                    const isWrongSelected = feedback && isSelected && !feedback.isCorrect;

                    let bg = "#0F172A";
                    let border = "#2D3748";
                    let labelBg = "#1E293B";
                    let labelColor = "#64748B";

                    if (isCorrectOption && feedback) {
                      bg = "rgba(74,222,128,0.08)";
                      border = "#4ADE80";
                      labelBg = "#4ADE80";
                      labelColor = "#fff";
                    } else if (isWrongSelected) {
                      bg = "rgba(239,68,68,0.08)";
                      border = "#EF4444";
                      labelBg = "#EF4444";
                      labelColor = "#fff";
                    } else if (isSelected) {
                      bg = `${subjectColor}12`;
                      border = subjectColor;
                      labelBg = subjectColor;
                      labelColor = "#fff";
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => !answered && setSelected(key)}
                        disabled={answered}
                        style={{
                          textAlign: "left", padding: "16px 20px", borderRadius: 12,
                          background: bg, border: `2px solid ${border}`,
                          cursor: answered ? "default" : "pointer",
                          transition: "all 0.2s", display: "flex", alignItems: "flex-start", gap: 16,
                          outline: "none",
                        }}
                      >
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                          background: labelBg, display: "flex", alignItems: "center",
                          justifyContent: "center", fontWeight: 700, fontSize: 13, color: labelColor,
                          transition: "all 0.2s",
                        }}>
                          {isCorrectOption && feedback ? "✓" : isWrongSelected ? "✗" : key}
                        </div>
                        <div style={{ flex: 1, paddingTop: 7 }}>
                          <span style={{ color: "#E2E8F0", fontSize: 15, lineHeight: 1.6 }}>
                            {question.options[key]}
                          </span>
                          {feedback && feedback.allOptionExplanations?.[key] && (
                            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
                              {feedback.allOptionExplanations[key]}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback card */}
              {feedback && (
                <div style={{
                  background: feedback.isCorrect ? "rgba(74,222,128,0.07)" : "rgba(239,68,68,0.07)",
                  border: `1px solid ${feedback.isCorrect ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.25)"}`,
                  borderRadius: 16, padding: "24px 28px", marginBottom: 20,
                }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>
                      {feedback.isCorrect ? "🎉" : "📖"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <span style={{
                          fontWeight: 900, fontSize: 17,
                          color: feedback.isCorrect ? "#4ADE80" : "#F87171",
                        }}>
                          {feedback.isCorrect ? "Correct!" : "Incorrect"}
                        </span>
                        <span style={{
                          fontWeight: 700, fontSize: 15,
                          color: feedback.scoreChange > 0 ? "#4ADE80" : "#F87171",
                        }}>
                          {feedback.scoreChange > 0 ? `+${feedback.scoreChange}` : feedback.scoreChange} points
                        </span>
                      </div>
                      {feedback.explanation && (
                        <p style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.75, margin: "0 0 10px" }}>
                          {feedback.explanation}
                        </p>
                      )}
                      {feedback.encouragement && (
                        <p style={{ color: "#94A3B8", fontSize: 13, margin: 0, fontStyle: "italic" }}>
                          {feedback.encouragement}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 12, paddingBottom: 48 }}>
                {!answered ? (
                  <button
                    onClick={doCheckAnswer}
                    disabled={!selected || practiceLoading}
                    style={{
                      padding: "15px 36px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 15,
                      background: selected
                        ? `linear-gradient(135deg, ${subjectColor}, ${subjectColor}CC)`
                        : "#1E293B",
                      color: selected ? "#fff" : "#475569",
                      cursor: selected ? "pointer" : "not-allowed",
                      boxShadow: selected ? `0 4px 20px ${subjectColor}40` : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    Check Answer →
                  </button>
                ) : (
                  <button
                    onClick={() => doFetchNextQuestion()}
                    disabled={practiceLoading}
                    style={{
                      padding: "15px 36px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 15,
                      background: `linear-gradient(135deg, ${subjectColor}, ${subjectColor}CC)`,
                      color: "#fff", cursor: "pointer",
                      boxShadow: `0 4px 20px ${subjectColor}40`,
                    }}
                  >
                    Next Question →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div style={{
        minHeight: "100vh", background: "#0F172A",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: `4px solid ${subjectColor}20`, borderTopColor: subjectColor,
            animation: "spin 0.8s linear infinite", margin: "0 auto 20px",
          }} />
          <p style={{ color: "#64748B", fontSize: 15 }}>Preparing your lesson with MEERA...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={{
        minHeight: "100vh", background: "#0F172A",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{
          maxWidth: 400, width: "100%", margin: "0 16px", padding: 36,
          background: "#1E293B", border: "1px solid #EF4444", borderRadius: 18, textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: "#F8FAFC", fontWeight: 800, margin: "0 0 10px" }}>Something went wrong</h2>
          <p style={{ color: "#94A3B8", fontSize: 14, margin: "0 0 24px" }}>{errorMsg || "Please try again."}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 32px", background: subjectColor, color: "#fff",
              border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  if (phase === "teaching") return renderTeaching();
  if (phase === "practice") return renderPractice();
  return null;
}
