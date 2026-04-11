"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  CHAPTER_BY_CODE,
  SUBJECT_CONFIG,
  NEET_EXAM_CONFIG,
  type NeetSubject,
  type NeetChapter,
} from "../../../lib/neetChapters";

// --- Types --------------------------------------------------------------------
type MCQOption = "A" | "B" | "C" | "D";

interface NeetQuestion {
  questionId: string;
  questionText: string;
  imageUrl?: string | null;           // figure shown above question stem
  optionImages?: Partial<Record<MCQOption, string | null>>; // per-option images
  options: Record<MCQOption, string>;
  correctOption: MCQOption;
  explanation: string;
  allOptionExplanations?: Record<MCQOption, string>;
  difficulty: "easy" | "medium" | "hard";
  neetYear?: string;
  topic: string;
  questionType?: "conceptual" | "numerical" | "assertion-reasoning";
}

interface SessionState {
  sessionId: string | null;
  subject: NeetSubject;
  chapterCode: string;
  currentQuestion: NeetQuestion | null;
  selectedOption: MCQOption | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  score: number;         // raw score (4 per correct, -1 per wrong)
  correct: number;
  wrong: number;
  skipped: number;
  questionsAttempted: number;
  phase: "loading" | "intro" | "question" | "feedback" | "complete" | "error";
  meeraMessage: string;
  meeraEmotion: "neutral" | "encouraging" | "celebrating" | "empathetic" | "focused";
  showAllExplanations: boolean;
  history: Array<{ questionId: string; selected: MCQOption; correct: MCQOption; isCorrect: boolean }>;
  elapsedSec: number;
  answeredQuestions: string[];
}

type SidebarTab = "chapters" | "progress" | "plan";

// --- Constants ----------------------------------------------------------------
const MEERA_MESSAGES = {
  intro: [
    "Let's make this session count. I'll guide you through every question.",
    "This chapter appears almost every NEET year. Pay close attention!",
    "We'll go step by step. When you get something wrong, I'll explain exactly why.",
  ],
  correct: [
    "Excellent! That's exactly right. You're building real exam readiness.",
    "Perfect! This is the kind of precision that gets you into MBBS.",
    "Yes! Spot on. Remember this approach ? it comes up in variants too.",
    "Brilliant! You clearly understand this concept well.",
  ],
  wrong: [
    "Not quite ? but this is a very common trap in NEET. Let me explain why.",
    "Close, but there's a subtle distinction here. This is what NEET tests.",
    "Don't worry ? this one trips many students. Let's understand the correct logic.",
    "This mistake is actually useful. It shows exactly where the concept needs clarity.",
  ],
  encouragement: [
    "You're doing well. Keep this focus through the exam.",
    "Two wrong in a row ? pause, breathe, and read the question again carefully.",
    "Remember: understanding why you're wrong is more valuable than just being right.",
    "Stay calm. Even AIR toppers made mistakes in practice sessions.",
  ],
  negative_warning: "?? Careful! NEET penalises wrong answers by 1 mark. Only attempt if you're 60%+ confident.",
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// --- Avatar -------------------------------------------------------------------
function MeeraAvatarLarge({ emotion }: { emotion: SessionState["meeraEmotion"] }) {
  const colorMap: Record<SessionState["meeraEmotion"], string> = {
    neutral: "#6D28D9",
    encouraging: "#2563EB",
    celebrating: "#D97706",
    empathetic: "#DC2626",
    focused: "#0F766E",
  };
  // We'll use a pulse animation if she's celebrating or encouraging
  const isActive = emotion === "celebrating" || emotion === "encouraging";
  
  return (
    <div style={{
      width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
      background: "#0F172A",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: `2px solid ${colorMap[emotion]}`,
      boxShadow: isActive ? `0 0 16px ${colorMap[emotion]}60` : `0 0 0 4px ${colorMap[emotion]}20`,
      transition: "all 0.3s ease",
      overflow: "hidden"
    }}>
      <img 
        src={`https://api.dicebear.com/7.x/bottts/svg?seed=MeeraNeet&backgroundColor=transparent`} 
        alt="MEERA Avatar" 
        style={{ width: "95%", height: "95%", transform: isActive ? "scale(1.05)" : "scale(1)", transition: "transform 0.3s ease" }} 
      />
    </div>
  );
}

// --- MCQ Question Card --------------------------------------------------------
function MCQCard({
  question,
  selectedOption,
  isAnswered,
  isCorrect,
  onSelect,
  subject,
}: {
  question: NeetQuestion;
  selectedOption: MCQOption | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  onSelect: (opt: MCQOption) => void;
  subject: NeetSubject;
}) {
  const subjectColor = SUBJECT_CONFIG.find((s) => s.id === subject)?.color ?? "#8B5CF6";
  const options: MCQOption[] = ["A", "B", "C", "D"];

  function optionStyle(opt: MCQOption) {
    const isSelected = selectedOption === opt;
    const isCorrectOpt = opt === question.correctOption;
    let bg = "#0F172A";
    let border = "#1E293B";
    let color = "#CBD5E1";
    if (isAnswered) {
      if (isCorrectOpt) { bg = "#064E3B"; border = "#10B981"; color = "#6EE7B7"; }
      else if (isSelected && !isCorrectOpt) { bg = "#450A0A"; border = "#EF4444"; color = "#FCA5A5"; }
    } else if (isSelected) {
      bg = `${subjectColor}18`; border = subjectColor; color = "#F8FAFC";
    } else {
      // hover handled inline
    }
    return { bg, border, color };
  }

  return (
    <div style={{
      background: "#0F172A", border: "1px solid #1E293B",
      borderRadius: 16, overflow: "hidden",
    }}>
      {/* Question header */}
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {question.neetYear && (
              <span style={{
                background: "linear-gradient(90deg, #F59E0B, #D97706)", 
                color: "#fff", borderRadius: 99,
                padding: "3px 10px", fontSize: 11, fontWeight: 800,
                boxShadow: "0 0 10px rgba(245, 158, 11, 0.4)",
                textTransform: "uppercase"
              }}>
                🎯 NEET {question.neetYear} PYQ
              </span>
            )}
            <span style={{
              background: question.difficulty === "hard" ? "#450A0A" : question.difficulty === "medium" ? "#431407" : "#042F2E",
              color: question.difficulty === "hard" ? "#FCA5A5" : question.difficulty === "medium" ? "#FED7AA" : "#6EE7B7",
              borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 700,
            }}>
              {question.difficulty.toUpperCase()}
            </span>
            <span style={{
              background: `${subjectColor}18`, color: subjectColor,
              borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 600,
            }}>
              {question.topic}
            </span>
          </div>
        </div>
        <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 600, lineHeight: 1.6 }}>
          {question.questionText}
        </div>

        {/* Question figure (optional) */}
        {question.imageUrl && (
          <figure style={{ margin: "14px 0 0", padding: 0 }}>
            <img
              src={question.imageUrl}
              alt="Question figure"
              style={{
                width: "100%", maxWidth: 540, display: "block",
                borderRadius: 8, border: "1px solid #334155",
                background: "#fff",           // white bg for diagrams with transparent areas
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <figcaption style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
              📐 Refer to the figure above
            </figcaption>
          </figure>
        )}
      </div>

      {/* Options */}
      <div style={{ padding: "14px 20px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt) => {
          const { bg, border, color } = optionStyle(opt);
          const isSelected = selectedOption === opt;
          const isCorrectOpt = opt === question.correctOption;
          return (
            <button
              key={opt}
              onClick={() => !isAnswered && onSelect(opt)}
              disabled={isAnswered}
              style={{
                width: "100%", textAlign: "left", padding: "12px 16px",
                background: bg, border: `1.5px solid ${border}`,
                borderRadius: 10, color, fontSize: 14, fontWeight: 500,
                cursor: isAnswered ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.15s", lineHeight: 1.5,
              }}
              onMouseEnter={(e) => {
                if (!isAnswered && !isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1E293B";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#334155";
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnswered && !isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.background = bg;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = border;
                }
              }}
            >
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                background: isAnswered && isCorrectOpt ? "#10B981" : isAnswered && isSelected && !isCorrectOpt ? "#EF4444" : "#1E293B",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: isAnswered ? "#fff" : "#94A3B8",
              }}>
                {isAnswered && isCorrectOpt ? "✓" : isAnswered && isSelected && !isCorrectOpt ? "✗" : opt}
              </span>
              <span style={{ flex: 1 }}>
                {question.options[opt]}
                {question.optionImages?.[opt] && (
                  <img
                    src={question.optionImages[opt]!}
                    alt={`Option ${opt} figure`}
                    style={{
                      display: "block", marginTop: 8,
                      maxWidth: 200, maxHeight: 120,
                      borderRadius: 6, border: "1px solid #334155",
                      background: "#fff",
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Feedback Block -----------------------------------------------------------
function FeedbackBlock({
  question,
  isCorrect,
  selectedOption,
  showAll,
  onToggleAll,
  subject,
}: {
  question: NeetQuestion;
  isCorrect: boolean;
  selectedOption: MCQOption;
  showAll: boolean;
  onToggleAll: () => void;
  subject: NeetSubject;
}) {
  const subjectColor = SUBJECT_CONFIG.find((s) => s.id === subject)?.color ?? "#8B5CF6";
  return (
    <div style={{
      background: isCorrect ? "#022C22" : "#1C0A0A",
      border: `1px solid ${isCorrect ? "#10B981" : "#EF4444"}`,
      borderRadius: 14, padding: "16px 20px", marginTop: 12,
    }}>
      <div style={{ fontWeight: 700, color: isCorrect ? "#10B981" : "#EF4444", fontSize: 15, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{isCorrect ? "? Correct!" : `? Incorrect ? Answer is Option ${question.correctOption}`}</span>
        <button
          onClick={async () => {
             try {
               const res = await fetch("/api/voice/tts", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ text: question.explanation, avatarId: "meera" }),
               });
               const data = await res.json();
               if (data.audioBase64) {
                 const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
                 audio.play();
               } else if (data.fallback === "speechSynthesis") {
                 const u = new SpeechSynthesisUtterance(question.explanation);
                 u.lang = "en-IN";
                 window.speechSynthesis.speak(u);
               }
             } catch (e) {
               console.error("TTS error", e);
             }
          }}
          style={{ background: `${subjectColor}20`, border: `1px solid ${subjectColor}40`, color: subjectColor, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}
          title="Explain this to me"
        >
          🔊 Explain
        </button>
      </div>
      <div style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
        {question.explanation}
      </div>

      <button
        onClick={onToggleAll}
        style={{
          background: "none", border: `1px solid ${subjectColor}40`,
          color: subjectColor, borderRadius: 6, padding: "5px 12px",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}
      >
        {showAll ? "Hide" : "Why are the other options wrong?"} ?
      </button>

      {showAll && question.allOptionExplanations && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {(["A", "B", "C", "D"] as MCQOption[]).map((opt) => (
            <div key={opt} style={{
              background: "#0F172A", borderRadius: 8, padding: "10px 14px",
              border: `1px solid ${opt === question.correctOption ? "#10B981" : "#1E293B"}`,
            }}>
              <span style={{
                fontWeight: 700, fontSize: 12,
                color: opt === question.correctOption ? "#10B981" : "#EF4444",
                marginRight: 8,
              }}>
                {opt === question.correctOption ? `? Option ${opt}` : `? Option ${opt}`}
              </span>
              <span style={{ color: "#94A3B8", fontSize: 13 }}>
                {question.allOptionExplanations![opt] ?? question.options[opt]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Diagram Block ------------------------------------------------------------
function DiagramBlock({ diagrams, subjectColor }: {
  diagrams: Array<{ id: string; title: string; src: string; caption: string; topic: string }>;
  subjectColor: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (!diagrams || diagrams.length === 0) return null;
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {diagrams.map((d) => (
          <button
            key={d.id}
            onClick={() => setOpenId(openId === d.id ? null : d.id)}
            style={{
              background: openId === d.id ? `${subjectColor}20` : "none",
              border: `1px solid ${openId === d.id ? subjectColor : "#1E293B"}`,
              color: openId === d.id ? subjectColor : "#64748b",
              borderRadius: 8, padding: "6px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ?? {d.title} {openId === d.id ? "?" : "?"}
          </button>
        ))}
      </div>
      {diagrams.map((d) => openId === d.id && (
        <div key={d.id} style={{
          marginTop: 10, background: "#0d1117", borderRadius: 10,
          border: `1px solid ${subjectColor}30`, padding: 12, overflow: "hidden",
        }}>
          <img
            src={d.src}
            alt={d.title}
            style={{ width: "100%", maxWidth: 560, display: "block", margin: "0 auto", borderRadius: 8 }}
          />
          <div style={{ color: "#64748b", fontSize: 11, textAlign: "center", marginTop: 8 }}>
            {d.caption}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Score Display ------------------------------------------------------------
function ScoreBar({ score, correct, wrong, skipped }: { score: number; correct: number; wrong: number; skipped: number }) {
  const maxPossible = (correct + wrong + skipped) * 4;
  const pct = maxPossible > 0 ? Math.max(0, (score / maxPossible) * 100) : 0;
  return (
    <div style={{ background: "#0F172A", borderRadius: 12, padding: "12px 16px", border: "1px solid #1E293B" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
        <span style={{ color: "#10B981", fontWeight: 700 }}>+{correct * 4}</span>
        <span style={{ fontWeight: 800, color: "#F8FAFC", fontSize: 16 }}>{score}</span>
        <span style={{ color: "#EF4444", fontWeight: 700 }}>-{wrong}</span>
      </div>
      <div style={{ background: "#1E293B", borderRadius: 99, height: 6 }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: pct > 50 ? "linear-gradient(90deg, #10B981, #34D399)" : "linear-gradient(90deg, #F59E0B, #EF4444)",
          borderRadius: 99, transition: "width 0.4s ease",
        }} />
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: "#64748b" }}>
        <span>? {correct} correct</span>
        <span>? {wrong} wrong</span>
        <span>? {skipped} skipped</span>
      </div>
    </div>
  );
}

// --- Left Sidebar ? Chapter Tree ----------------------------------------------
function ChapterSidebar({
  activeChapterCode,
  subject,
  onChapterSelect,
  studentClass,
}: {
  activeChapterCode: string;
  subject: NeetSubject;
  onChapterSelect: (code: string) => void;
  studentClass?: string | null;
}) {
  // class_11 → only show Class 11 chapters; class_12/dropper/null → show all
  const [showAll, setShowAll] = useState(false);
  const classFilter = (studentClass === "class_11" && !showAll) ? "11" : null;

  return (
    <div style={{ overflowY: "auto", flex: 1, paddingBottom: 16 }}>
      {studentClass === "class_11" && (
        <div style={{ padding: "6px 12px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, color: showAll ? "#94A3B8" : "#F59E0B", fontWeight: 700 }}>
            {showAll ? "📋 ALL CHAPTERS" : "📘 CLASS 11 ONLY"}
          </span>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 99,
              border: "none", cursor: "pointer", letterSpacing: 0.3,
              background: showAll ? "#334155" : "#F59E0B22",
              color: showAll ? "#94A3B8" : "#F59E0B",
            }}
          >
            {showAll ? "Filter by Class 11" : "Show All Grades"}
          </button>
        </div>
      )}
      {SUBJECT_CONFIG.map((subj) => {
        const filteredChapters = classFilter
          ? subj.chapters.filter((ch) => ch.ncertClass === classFilter)
          : subj.chapters;
        if (filteredChapters.length === 0) return null;
        return (
        <div key={subj.id} style={{ marginBottom: 8 }}>
          <div style={{
            padding: "8px 16px", fontSize: 11, fontWeight: 800,
            color: subj.id === subject ? subj.color : "#475569",
            letterSpacing: 0.8, textTransform: "uppercase",
            borderLeft: subj.id === subject ? `3px solid ${subj.color}` : "3px solid transparent",
          }}>
            {subj.emoji} {subj.label} ({filteredChapters.length} chapters)
          </div>
          {filteredChapters.map((ch) => {
            const isActive = ch.chapterCode === activeChapterCode;
            return (
              <div
                key={ch.chapterCode}
                onClick={() => onChapterSelect(ch.chapterCode)}
                style={{
                  padding: "7px 16px 7px 22px",
                  background: isActive ? `${subj.color}18` : "transparent",
                  borderLeft: isActive ? `3px solid ${subj.color}` : "3px solid transparent",
                  cursor: "pointer", transition: "all 0.1s",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "#1E293B";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                <span style={{
                  fontSize: 12, color: isActive ? "#F8FAFC" : "#64748b",
                  fontWeight: isActive ? 600 : 400, lineHeight: 1.4,
                }}>
                  {ch.title}
                </span>
                <div style={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: 4 }}>
                  {Array.from({ length: ch.neetWeight }, (_, i) => (
                    <span key={i} style={{ color: "#F59E0B", fontSize: 7 }}>?</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        );
      })}
    </div>
  );
}

// --- Right Sidebar — Progress & Plan -----------------------------------------
function RightSidebar({
  session,
  chapter,
}: {
  session: SessionState;
  chapter: NeetChapter | undefined;
}) {
  const subjectColor = SUBJECT_CONFIG.find((s) => s.id === session.subject)?.color ?? "#8B5CF6";
  const accuracy = session.questionsAttempted > 0
    ? Math.round((session.correct / session.questionsAttempted) * 100)
    : 0;

  const days = Math.max(0, Math.ceil((new Date(NEET_EXAM_CONFIG.targetDate).getTime() - Date.now()) / 86400000));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Chapter info */}
      {chapter && (
        <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 13, marginBottom: 6 }}>
            ?? {chapter.title}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
            NCERT Class {chapter.ncertClass} ? Ch {chapter.ncertChapter}
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: `${subjectColor}18`, borderRadius: 99,
            padding: "2px 10px", fontSize: 11, color: subjectColor, fontWeight: 700,
          }}>
            ~{chapter.avgQuestionsPerYear} Q/year in NEET
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
            {chapter.highYieldTags.map((tag) => (
              <span key={tag} style={{
                background: "#1E293B", color: "#94A3B8", borderRadius: 99,
                padding: "2px 7px", fontSize: 10,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Live score */}
      <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 13, marginBottom: 10 }}>
          ?? Session Score
        </div>
        <ScoreBar
          score={session.score}
          correct={session.correct}
          wrong={session.wrong}
          skipped={session.skipped}
        />
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "#64748b" }}>Accuracy</span>
          <span style={{
            fontWeight: 700,
            color: accuracy >= 70 ? "#10B981" : accuracy >= 50 ? "#F59E0B" : "#EF4444",
          }}>
            {accuracy}%
          </span>
        </div>
      </div>

      {/* Negative marking reminder */}
      {session.wrong >= 2 && (
        <div style={{
          background: "#1C0A0A", border: "1px solid #EF4444",
          borderRadius: 12, padding: "12px 14px", fontSize: 12,
        }}>
          <div style={{ color: "#EF4444", fontWeight: 700, marginBottom: 4 }}>?? Negative Marking Alert</div>
          <div style={{ color: "#FCA5A5", lineHeight: 1.5 }}>
            You've lost {session.wrong} marks to wrong answers. Only attempt when you're 60%+ confident.
          </div>
        </div>
      )}

      {/* NEET countdown */}
      <div style={{
        background: "linear-gradient(135deg, #1E1035, #0F172A)",
        border: "1px solid #6D28D9", borderRadius: 12, padding: "14px 16px", textAlign: "center",
      }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: days < 100 ? "#EF4444" : "#F59E0B" }}>{days}</div>
        <div style={{ fontSize: 11, color: "#8B5CF6", fontWeight: 700 }}>DAYS TO NEET 2027</div>
        <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
          {Math.round(days * 2)} hours of study remaining at 2hr/day
        </div>
      </div>

      {/* Subject accuracy */}
      <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 13, marginBottom: 10 }}>?? Subject Accuracy</div>
        {SUBJECT_CONFIG.map((subj) => {
          const acc = parseInt(localStorage.getItem(`neet_acc_${subj.id}`) || "0");
          return (
            <div key={subj.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#94A3B8" }}>{subj.emoji} {subj.label}</span>
                <span style={{ color: subj.color, fontWeight: 700 }}>{acc}%</span>
              </div>
              <div style={{ background: "#1E293B", borderRadius: 99, height: 4 }}>
                <div style={{ width: `${acc}%`, height: "100%", background: subj.bgGradient, borderRadius: 99 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick nav */}
      <a href="/ai-tutor/neet" style={{
        display: "block", background: "#0F172A", border: "1px solid #1E293B",
        borderRadius: 10, padding: "10px 14px", textDecoration: "none",
        color: "#64748b", fontSize: 12, textAlign: "center",
        transition: "all 0.15s",
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#F8FAFC"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}
      >
        ? Back to Subject Selector
      </a>
    </div>
  );
}

// Line type metadata
const LINE_TYPE_META: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  definition:  { icon: "📖", color: "#818CF8", bg: "#818CF808", label: "Definition" },
  formula:     { icon: "🔢", color: "#F59E0B", bg: "#F59E0B08", label: "Formula"    },
  fact:        { icon: "⚡", color: "#34D399", bg: "#34D39908", label: "Key Fact"   },
  experiment:  { icon: "🧪", color: "#60A5FA", bg: "#60A5FA08", label: "Experiment" },
  process:     { icon: "🔄", color: "#A78BFA", bg: "#A78BFA08", label: "Process"    },
  comparison:  { icon: "⚖️",  color: "#FCD34D", bg: "#FCD34D08", label: "Comparison"},
  exception:   { icon: "⚠️",  color: "#F87171", bg: "#F8717108", label: "Exception" },
};

// Highlight numbers, ratios, percentages, years with amber pen effect
function HighlightedLine({ text }: { text: string }) {
  // Match numbers, ratios (3:1), percentages, years (1856-1863), fractions (1/4)
  const parts = text.split(/(\b\d[\d,./:-]*\d*\s*(?:%|mm³|°C|kJ|mol|nm|m\/s|cm)?\b|\b\d\b)/g);
  return (
    <span>
      {parts.map((part, i) =>
        /^\d/.test(part) ? (
          <mark key={i} style={{
            background: "linear-gradient(120deg, #F59E0B33 0%, #FCD34D44 100%)",
            color: "#FCD34D", borderRadius: 3, padding: "1px 3px",
            fontWeight: 700, fontStyle: "normal",
          }}>{part}</mark>
        ) : part
      )}
    </span>
  );
}

// --- Chapter Overview ---------------------------------------------------------
function ChapterOverview({ content, ncertLines, subjectColor, onStart, chapterCode }: {
  content: any;
  ncertLines: any[];
  subjectColor: string;
  onStart: () => void;
  chapterCode?: string;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "ncert" | "figures">("overview");
  const stars = Array.from({ length: 5 }, (_, i) => i < content.neetWeight ? "⭐" : "☆").join("");
  // NCERT lines state
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [showAllLines, setShowAllLines]   = useState(false);
  const LINES_PREVIEW = 6;

  const allTopics = ["All", ...Array.from(new Set(ncertLines.map((l: any) => l.topic || "General")))];
  const filteredLines = selectedTopic === "All"
    ? ncertLines
    : ncertLines.filter((l: any) => (l.topic || "General") === selectedTopic);
  const visibleLines = showAllLines ? filteredLines : filteredLines.slice(0, LINES_PREVIEW);

  // Group NCERT lines by topic (for overview fallback)
  const linesByTopic = ncertLines.reduce((acc: Record<string, any[]>, line: any) => {
    const t = line.topic || "General";
    if (!acc[t]) acc[t] = [];
    acc[t].push(line);
    return acc;
  }, {});

  // Figures — from chapter API (merged figures JSON + chapter diagrams)
  const figures = content.figures ?? content.diagrams ?? [];

  const tabs = [
    { id: "overview", label: "📚 Overview" },
    { id: "ncert",    label: `📖 NCERT Lines${ncertLines.length ? ` (${ncertLines.length})` : ""}` },
    { id: "figures",  label: `🖼️ Figures${figures.length ? ` (${figures.length})` : ""}` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header card */}
      <div style={{ background: `linear-gradient(135deg, ${subjectColor}22, #0F172A)`, border: `1px solid ${subjectColor}40`, borderRadius: 16, padding: "20px 22px" }}>
        <div style={{ fontSize: 12, color: subjectColor, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
          {content.subject} · Class {content.gradeBand}
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC", marginBottom: 8 }}>{content.title}</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#F59E0B", fontWeight: 700 }}>{stars} NEET Importance</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>~{content.avgQuestionsPerYear} Q/year in NEET</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>⏱ {content.estimatedMinutes} min to study</span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, background: "#1E293B", borderRadius: 12, padding: 4 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1, padding: "8px 6px", borderRadius: 9, border: "none",
              background: activeTab === tab.id ? subjectColor : "transparent",
              color: activeTab === tab.id ? "#fff" : "#94A3B8",
              fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Learning Goals */}
          <div style={{ background: "#1E293B", borderRadius: 14, padding: "16px 20px", border: "1px solid #334155" }}>
            <div style={{ fontWeight: 800, color: "#C4B5FD", fontSize: 13, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>🎯 What you'll learn</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {content.learningGoals.map((g: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: subjectColor, fontWeight: 800, flexShrink: 0, fontSize: 13 }}>{i + 1}.</span>
                  <span style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.6 }}>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Facts */}
          {content.keyFacts?.length > 0 && (
            <div style={{ background: "#1E293B", borderRadius: 14, padding: "16px 20px", border: "1px solid #334155" }}>
              <div style={{ fontWeight: 800, color: "#FCD34D", fontSize: 13, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>✦ High-Yield Facts (memorise these)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {content.keyFacts.map((f: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: "#0F172A", borderRadius: 8, borderLeft: `3px solid #F59E0B` }}>
                    <span style={{ color: "#F59E0B", flexShrink: 0 }}>✦</span>
                    <span style={{ color: "#E2E8F0", fontSize: 13, lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {content.commonMistakes?.length > 0 && (
            <div style={{ background: "#1E293B", borderRadius: 14, padding: "16px 20px", border: "1px solid #334155" }}>
              <div style={{ fontWeight: 800, color: "#FCA5A5", fontSize: 13, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>⚠️ Common Mistakes in NEET</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {content.commonMistakes.map((m: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: "#0F172A", borderRadius: 8, borderLeft: "3px solid #EF4444" }}>
                    <span style={{ color: "#EF4444", flexShrink: 0 }}>✗</span>
                    <span style={{ color: "#E2E8F0", fontSize: 13, lineHeight: 1.6 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtopics */}
          {content.subtopics?.length > 0 && (
            <div style={{ background: "#1E293B", borderRadius: 14, padding: "16px 20px", border: "1px solid #334155" }}>
              <div style={{ fontWeight: 800, color: "#6EE7B7", fontSize: 13, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>📋 Topics covered</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {content.subtopics.map((t: string, i: number) => (
                  <span key={i} style={{ background: `${subjectColor}18`, color: subjectColor, border: `1px solid ${subjectColor}40`, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: NCERT LINES ── */}
      {activeTab === "ncert" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ncertLines.length === 0 ? (
            <div style={{ background: "#1E293B", borderRadius: 16, padding: "40px 24px", border: "1px solid #334155", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📖</div>
              <div style={{ color: "#94A3B8", fontSize: 14, fontWeight: 600 }}>NCERT lines coming soon</div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>We're extracting key lines from the NCERT textbook for this chapter</div>
            </div>
          ) : (<>

            {/* Intro banner */}
            <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", borderRadius: 14, padding: "14px 18px", border: "1px solid #334155", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 28 }}>📚</span>
              <div>
                <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 13 }}>NCERT Cheat Sheet</div>
                <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>
                  {ncertLines.length} key lines from the textbook · <span style={{ color: "#FCD34D" }}>Numbers highlighted</span> · Trick answers marked
                </div>
              </div>
            </div>

            {/* Topic filter pills */}
            {allTopics.length > 2 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {allTopics.map((t) => (
                  <button key={t} onClick={() => { setSelectedTopic(t); setShowAllLines(false); }} style={{
                    padding: "5px 12px", borderRadius: 99, border: "none", cursor: "pointer",
                    fontSize: 11, fontWeight: 700, transition: "all 0.15s",
                    background: selectedTopic === t ? subjectColor : "#1E293B",
                    color:      selectedTopic === t ? "#fff"        : "#94A3B8",
                    boxShadow:  selectedTopic === t ? `0 0 0 1px ${subjectColor}` : "0 0 0 1px #334155",
                  }}>{t}</button>
                ))}
              </div>
            )}

            {/* Lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {visibleLines.map((line: any, i: number) => {
                const meta = LINE_TYPE_META[line.line_type] ?? LINE_TYPE_META.fact;
                const isException = line.line_type === "exception";
                const isFormula   = line.line_type === "formula";
                return (
                  <div key={i} style={{
                    background: meta.bg,
                    borderRadius: 14,
                    border: `1px solid ${meta.color}28`,
                    borderLeft: `4px solid ${meta.color}`,
                    padding: "14px 18px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "box-shadow 0.2s",
                  }}>
                    {/* Badge row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                      <span style={{ fontSize: 15 }}>{meta.icon}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
                        color: meta.color, textTransform: "uppercase",
                      }}>{meta.label}</span>
                      {line.neet_relevance === "high" && !isException && (
                        <span style={{
                          fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 99,
                          background: "#F59E0B22", color: "#FCD34D",
                          border: "1px solid #F59E0B44", letterSpacing: 0.4,
                        }}>★ HIGH YIELD</span>
                      )}
                      {isException && (
                        <span style={{
                          fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 99,
                          background: "#EF444422", color: "#F87171",
                          border: "1px solid #EF444444", letterSpacing: 0.4,
                        }}>⚠ TRICK QUESTION ALERT</span>
                      )}
                      {line.topic && (
                        <span style={{ marginLeft: "auto", fontSize: 10, color: "#64748B", fontStyle: "italic" }}>
                          {line.topic}
                        </span>
                      )}
                    </div>

                    {/* Line text */}
                    <div style={{
                      color: "#E2E8F0",
                      fontSize: isFormula ? 14 : 13.5,
                      lineHeight: 1.8,
                      fontStyle: line.line_type === "definition" ? "italic" : "normal",
                      fontFamily: isFormula ? "monospace" : "inherit",
                      letterSpacing: isFormula ? 0.3 : 0,
                    }}>
                      <HighlightedLine text={line.line_text} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show more / less */}
            {filteredLines.length > LINES_PREVIEW && (
              <button onClick={() => setShowAllLines(!showAllLines)} style={{
                width: "100%", padding: "12px", borderRadius: 12,
                border: `1px dashed ${subjectColor}60`,
                background: "transparent", color: subjectColor,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>
                {showAllLines
                  ? "▲ Show less"
                  : `▼ Show all ${filteredLines.length} lines (${filteredLines.length - LINES_PREVIEW} more)`}
              </button>
            )}
          </>)}
        </div>
      )}

      {/* ── TAB: FIGURES ── */}
      {activeTab === "figures" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {figures.length === 0 ? (
            <div style={{ background: "#1E293B", borderRadius: 16, padding: "40px 24px", border: "1px dashed #334155", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🖼️</div>
              <div style={{ color: "#94A3B8", fontSize: 14, fontWeight: 600 }}>Figures coming soon</div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>Key NCERT diagrams will appear here</div>
            </div>
          ) : (<>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", borderRadius: 14, padding: "14px 18px", border: "1px solid #334155", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 28 }}>🖼️</span>
              <div>
                <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 13 }}>NCERT Figures & Diagrams</div>
                <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>
                  {figures.length} key diagrams · Study each before practising
                </div>
              </div>
            </div>

            {figures.map((fig: any, i: number) => {
              const freqColor = fig.neetFrequency === "very high" ? "#F87171"
                              : fig.neetFrequency === "high"      ? "#F59E0B"
                              : "#94A3B8";
              const freqLabel = fig.neetFrequency === "very high" ? "🔥 Very High NEET Frequency"
                              : fig.neetFrequency === "high"      ? "⚡ High NEET Frequency"
                              : "📌 Moderate Frequency";
              return (
                <div key={i} style={{ background: "#1E293B", borderRadius: 16, border: "1px solid #334155", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>

                  {/* Figure number + topic bar */}
                  <div style={{ background: `${subjectColor}18`, borderBottom: `1px solid ${subjectColor}30`, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: subjectColor, color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>Fig {i + 1}</span>
                      <span style={{ color: subjectColor, fontSize: 11, fontWeight: 700 }}>{fig.topic}</span>
                    </div>
                    <span style={{ fontSize: 10, color: freqColor, fontWeight: 700 }}>{freqLabel}</span>
                  </div>

                  {/* Image or styled placeholder */}
                  {fig.src ? (
                    <div style={{ background: "#0F172A", padding: 16 }}>
                      <img src={fig.src} alt={fig.title}
                        style={{ width: "100%", borderRadius: 10, display: "block", border: `1px solid ${subjectColor}30` }} />
                    </div>
                  ) : (
                    <div style={{
                      background: `linear-gradient(135deg, ${subjectColor}0D 0%, #0F172A 100%)`,
                      height: 130, display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 6,
                      borderBottom: "1px solid #334155",
                    }}>
                      <span style={{ fontSize: 36 }}>🖼️</span>
                      <span style={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>Diagram being prepared</span>
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>

                    {/* Title */}
                    <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 15 }}>{fig.title}</div>

                    {/* What it shows */}
                    {fig.whatItShows?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 7 }}>What this diagram shows</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {fig.whatItShows.map((point: string, j: number) => (
                            <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <span style={{ color: subjectColor, fontWeight: 900, fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                              <span style={{ color: "#CBD5E1", fontSize: 12.5, lineHeight: 1.6 }}>
                                <HighlightedLine text={point} />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NEET Tip */}
                    {fig.neetTip && (
                      <div style={{ background: "#0F172A", borderRadius: 10, padding: "10px 14px", borderLeft: "3px solid #F59E0B" }}>
                        <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>💡 NEET Tip</div>
                        <div style={{ color: "#E2E8F0", fontSize: 12.5, lineHeight: 1.65 }}>{fig.neetTip}</div>
                      </div>
                    )}

                    {/* Memory Aid */}
                    {fig.memoryAid && (
                      <div style={{ background: `${subjectColor}12`, borderRadius: 10, padding: "9px 14px", border: `1px dashed ${subjectColor}40`, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 14 }}>🧠</span>
                        <div>
                          <div style={{ fontSize: 10, color: subjectColor, fontWeight: 800, letterSpacing: 0.4, marginBottom: 3 }}>MEMORY AID</div>
                          <div style={{ color: "#CBD5E1", fontSize: 12.5, fontStyle: "italic" }}>{fig.memoryAid}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>)}
        </div>
      )}

      {/* PYQ Practice shortcut */}
      {chapterCode && (
        <a
          href={`/ai-tutor/neet/pyq?chapter=${chapterCode}`}
          style={{
            display: "block", width: "100%", padding: "12px 16px", boxSizing: "border-box",
            background: "#0C2A4A", border: "1px solid #38BDF8", borderRadius: 12,
            color: "#38BDF8", fontSize: 14, fontWeight: 700, textAlign: "center",
            textDecoration: "none", marginTop: 4,
          }}
        >
          📚 Practice Past Year Questions (PYQs) →
        </a>
      )}

      {/* Start button — always visible */}
      <button
        onClick={onStart}
        style={{
          width: "100%", padding: "16px", background: subjectColor,
          border: "none", borderRadius: 14, color: "#fff",
          fontSize: 16, fontWeight: 800, cursor: "pointer",
          marginTop: 4,
        }}
      >
        Start Practising → ({content.questionCount} questions available)
      </button>
    </div>
  );
}

// --- Doubt Chat Component -----------------------------------------------------
function DoubtChat({ question, subjectColor }: { question: NeetQuestion, subjectColor: string }) {
  const [messages, setMessages] = useState<{role: "user" | "meera", text: string}[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    
    try {
      // 1. Send doubt to Sarvam + NCERT backend
      const res = await fetch("/api/neet/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           question, 
           userMessage: userMsg, 
           history: messages,
           ncertClass: "11", // Defaulting for now, will get from chapter in future
           subject: question.topic?.toLowerCase().includes("physics") ? "physics" : "biology",
           topic: question.topic
        })
      });
      
      const data = await res.json();
      const meeraReply = data.content || data.error || "Sorry, I had trouble processing that.";
      setMessages(prev => [...prev, { role: "meera", text: meeraReply }]);

      // 2. Speak the response using Sarvam TTS
      try {
        const ttsRes = await fetch("/api/voice/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: meeraReply, avatarId: "meera" }),
        });
        const ttsData = await ttsRes.json();
        if (ttsData.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${ttsData.audioBase64}`);
          audio.play();
        } else if (ttsData.fallback === "speechSynthesis") {
          const u = new SpeechSynthesisUtterance(meeraReply);
          u.lang = "en-IN";
          window.speechSynthesis.speak(u);
        }
      } catch (e) {
        console.error("TTS auto-play failed", e);
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: "meera", text: "I'm having network issues connecting to my brain! Please check your connection." }]);
    }
  };

  if (messages.length === 0) {
    return (
      <button
        onClick={() => setMessages([{ role: "meera", text: `What's confusing you about this question? I can explain any step or specific option.` }])}
        style={{
          width: "100%", padding: "12px", background: "none", border: `1px solid ${subjectColor}40`,
          borderRadius: 10, color: subjectColor, fontSize: 13, fontWeight: 700, cursor: "pointer",
          marginTop: 12, transition: "background 0.2s"
        }}
      >
        💬 Ask MEERA a doubt about this question
      </button>
    );
  }

  return (
    <div style={{ marginTop: 16, border: `1px solid ${subjectColor}40`, borderRadius: 12, background: "#0F172A", overflow: "hidden" }}>
      <div style={{ background: `${subjectColor}20`, padding: "10px 14px", fontSize: 12, fontWeight: 700, color: subjectColor, borderBottom: `1px solid ${subjectColor}30` }}>
        MEERA Doubt Chat
      </div>
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12, maxHeight: 300, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            {m.role === "meera" && <div style={{ width: 24, height: 24, borderRadius: "50%", background: subjectColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🤖</div>}
            <div style={{ background: m.role === "user" ? subjectColor : "#1E293B", color: "#F8FAFC", padding: "10px 14px", borderRadius: 12, borderTopRightRadius: m.role === "user" ? 2 : 12, borderTopLeftRadius: m.role === "meera" ? 2 : 12, fontSize: 13, lineHeight: 1.5 }}>
              {m.text}
            </div>
            {m.role === "user" && <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#475569", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>👤</div>}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: 10, borderTop: "1px solid #1E293B", display: "flex", gap: 8, background: "#030712" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="E.g. Why is option B incorrect?"
          style={{ flex: 1, background: "#0F172A", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", color: "#F8FAFC", fontSize: 13, outline: "none" }}
        />
        <button onClick={handleSend} style={{ background: subjectColor, border: "none", borderRadius: 8, padding: "0 16px", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
          Send
        </button>
      </div>
    </div>
  );
}
export default function NeetTutorClient({
  initialSubject,
  initialChapter,
  studentClass,
}: {
  initialSubject: NeetSubject;
  initialChapter: string;
  studentClass?: string | null;   // "class_11" | "class_12" | "dropper" | null
}) {
  const [session, setSession] = useState<SessionState>({
    sessionId: null,
    subject: initialSubject,
    chapterCode: initialChapter,
    currentQuestion: null,
    selectedOption: null,
    isAnswered: false,
    isCorrect: null,
    score: 0,
    correct: 0,
    wrong: 0,
    skipped: 0,
    questionsAttempted: 0,
    phase: "loading",
    meeraMessage: pickRandom(MEERA_MESSAGES.intro),
    meeraEmotion: "neutral",
    showAllExplanations: false,
    history: [],
    elapsedSec: 0,
    answeredQuestions: [],
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chapterContent, setChapterContent] = useState<any>(null);
  const [ncertLines, setNcertLines] = useState<any[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chapter = CHAPTER_BY_CODE[session.chapterCode];
  const subjectConfig = SUBJECT_CONFIG.find((s) => s.id === session.subject);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSession((prev) => ({ ...prev, elapsedSec: prev.elapsedSec + 1 }));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Build fallback content from neetChapters.ts when API has no JSON for this chapter
  const buildFallbackContent = (code: string) => {
    const ch = CHAPTER_BY_CODE[code];
    if (!ch) return null;
    return {
      chapterCode: ch.chapterCode,
      title:       ch.title,
      subject:     ch.subject,
      neetWeight:  ch.neetWeight,
      avgQuestionsPerYear: ch.avgQuestionsPerYear,
      estimatedMinutes:    ch.estimatedMinutes,
      gradeBand:   ch.ncertClass,
      subtopics:   ch.subtopics ?? [],
      learningGoals:  ch.highYieldTags.map((t) => `Understand and apply: ${t}`),
      keyFacts:       [],
      commonMistakes: [],
      coreIdeas:      [],
      figures:        [],
      questionCount:  0,
    };
  };

  // Load chapter overview content + NCERT lines on mount / chapter change
  useEffect(() => {
    setChapterContent(null);
    setNcertLines([]);
    setSession((prev) => ({ ...prev, phase: "intro" }));

    const code = session.chapterCode;

    Promise.all([
      fetch(`/api/neet/chapter?code=${code}`)
        .then((r) => r.json())
        .catch(() => ({})),
      fetch(`/api/neet/ncert-lines?chapter=${code}&limit=20`)
        .then((r) => r.json())
        .catch(() => ({ lines: [] })),
    ]).then(([chapterData, ncertData]) => {
      // Use API data if available, else fall back to neetChapters.ts data
      setChapterContent(chapterData.chapter ?? buildFallbackContent(code));
      if (ncertData.lines) setNcertLines(ncertData.lines);
    });
  }, [session.chapterCode]);

  // Load first question when student clicks Start Practising
  function handleStartPractising() {
    setSession((prev) => ({ ...prev, phase: "loading" }));
    loadNextQuestion();
  }

  const apiBase = process.env.NEXT_PUBLIC_TUTOR_API_URL ?? "/ai-tutor-api";

  async function startSession(subject: NeetSubject, chapterCode: string): Promise<string | null> {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rd_token") ?? "" : "";
      const resp = await fetch(`${apiBase}/tutor/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, courseId: `neet_${subject}`, chapterCode }),
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      return data.sessionId ?? null;
    } catch {
      return null;
    }
  }

  async function loadNextQuestion() {
    setSession((prev) => ({
      ...prev,
      phase: "loading",
      currentQuestion: null,
      selectedOption: null,
      isAnswered: false,
      isCorrect: null,
      showAllExplanations: false,
    }));

    try {
      let sid = session.sessionId;
      if (!sid) {
        sid = await startSession(session.subject, session.chapterCode);
        if (sid) setSession((prev) => ({ ...prev, sessionId: sid }));
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("rd_token") ?? "" : "";
      const resp = await fetch(`${apiBase}/tutor/next-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          token,
          courseId: `neet_${session.subject}`,
          chapterCode: session.chapterCode,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const q = mapApiQuestion(data);
        setSession((prev) => ({
          ...prev,
          currentQuestion: q,
          phase: "question",
          meeraMessage: pickRandom(MEERA_MESSAGES.intro),
          meeraEmotion: "focused",
        }));
        return;
      }
    } catch { /* fall through to MEERA question bank */ }

    // Try MEERA question bank (meera_neet_questions table)
    try {
      const seenIds = session.answeredQuestions?.join(",") ?? "";
      const excludeParam = seenIds ? `&exclude=${seenIds}` : "";
      const qResp = await fetch(
        `/api/neet/questions?chapter=${session.chapterCode}&limit=1${excludeParam}`
      );
      if (qResp.ok) {
        const qData = await qResp.json();
        if (qData.questions && qData.questions.length > 0) {
          const raw = qData.questions[0];
          const q: NeetQuestion = {
            questionId:   raw.questionId,
            questionText: raw.questionText,
            options:      raw.options,
            correctOption: raw.correctOption,
            explanation:  raw.explanation ?? "",
            difficulty:   raw.difficulty ?? "medium",
            topic:        raw.topic ?? "",
            allOptionExplanations: undefined,
          };
          setSession((prev) => ({
            ...prev,
            currentQuestion: q,
            phase: "question",
            meeraMessage: pickRandom(MEERA_MESSAGES.intro),
            meeraEmotion: "focused",
          }));
          return;
        }
      }
    } catch { /* fall through to placeholder */ }

    // Final fallback: placeholder
    setSession((prev) => ({
      ...prev,
      currentQuestion: placeholderQuestion(prev.chapterCode, prev.subject),
      phase: "question",
      meeraMessage: "Questions for this chapter are being prepared. Check back soon!",
      meeraEmotion: "neutral",
    }));
  }

  function mapApiQuestion(data: Record<string, unknown>): NeetQuestion {
    const q = (data.question ?? data) as Record<string, unknown>;
    const options = (q.options as Record<string, string>) ?? { A: "", B: "", C: "", D: "" };
    return {
      questionId: String(q.questionId ?? q.id ?? "Q1"),
      questionText: String(q.questionText ?? q.question ?? q.prompt ?? ""),
      options: {
        A: options.A ?? options.a ?? "",
        B: options.B ?? options.b ?? "",
        C: options.C ?? options.c ?? "",
        D: options.D ?? options.d ?? "",
      },
      correctOption: (String(q.correctOption ?? q.correct ?? "A").toUpperCase()) as MCQOption,
      explanation: String(q.explanation ?? q.rationale ?? ""),
      allOptionExplanations: (q.allOptionExplanations as Record<MCQOption, string>) ?? undefined,
      difficulty: (q.difficulty as NeetQuestion["difficulty"]) ?? "medium",
      neetYear: String(q.neetYear ?? q.year ?? ""),
      topic: String(q.topic ?? ""),
      questionType: (q.questionType as NeetQuestion["questionType"]) ?? "conceptual",
    };
  }

  function placeholderQuestion(chapterCode: string, subject: NeetSubject): NeetQuestion {
    const chap = CHAPTER_BY_CODE[chapterCode];
    const topic = chap?.subtopics[0] ?? chapterCode;

    const samples: Record<string, NeetQuestion> = {
      PHY_ELECTROSTATICS: {
        questionId: "PHY_ES_SAMPLE_1",
        questionText: "A charge Q is enclosed in a Gaussian surface. If the surface is shrunk to half its original size while still enclosing the same charge, the electric flux through the surface will:",
        options: { A: "Become half", B: "Become double", C: "Remain unchanged", D: "Become zero" },
        correctOption: "C",
        explanation: "By Gauss's Law, electric flux F = Q_enclosed / e0. The flux depends only on the total charge enclosed, not on the shape or size of the Gaussian surface. Hence it remains unchanged.",
        allOptionExplanations: {
          A: "Incorrect. Gauss's law does not depend on surface size.",
          B: "Incorrect. The flux is independent of surface dimensions.",
          C: "Correct! F = Q/e0 ? only the enclosed charge matters.",
          D: "Incorrect. The charge is still enclosed, so flux is non-zero.",
        },
        difficulty: "medium", neetYear: "2022", topic: "Gauss's Law", questionType: "conceptual",
      },
      BIO_GENETICS: {
        questionId: "BIO_GEN_SAMPLE_1",
        questionText: "In a cross AaBb ? AaBb, what fraction of the offspring will be AAbb?",
        options: { A: "1/16", B: "1/8", C: "3/16", D: "1/4" },
        correctOption: "A",
        explanation: "For AA: probability = 1/4 (from Aa ? Aa). For bb: probability = 1/4 (from Bb ? Bb). Combined: 1/4 ? 1/4 = 1/16.",
        allOptionExplanations: {
          A: "Correct! P(AA) = 1/4 and P(bb) = 1/4, so P(AAbb) = 1/16.",
          B: "Incorrect. This would be P(Aabb) = 2/4 ? 1/4 = 1/8.",
          C: "Incorrect. 3/16 = P(A_bb) which includes both AA and Aa.",
          D: "Incorrect. 1/4 represents only one of the two gene loci.",
        },
        difficulty: "medium", neetYear: "2021", topic: "Mendelian Genetics", questionType: "conceptual",
      },
      CHEM_BONDING: {
        questionId: "CHEM_BOND_SAMPLE_1",
        questionText: "The hybridisation of central atom and shape of XeF4 are respectively:",
        options: { A: "sp?, tetrahedral", B: "sp?d?, square planar", C: "sp?d, trigonal bipyramidal", D: "sp?, triangular planar" },
        correctOption: "B",
        explanation: "Xe in XeF4 has 4 bond pairs + 2 lone pairs = 6 electron pairs total ? sp?d? hybridisation. The 2 lone pairs occupy axial positions, making the molecular shape square planar.",
        allOptionExplanations: {
          A: "Incorrect. sp? accounts for only 4 electron pairs, but Xe here has 6.",
          B: "Correct! 6 electron pairs ? sp?d?. Lone pairs are axial ? square planar shape.",
          C: "Incorrect. sp?d is for 5 electron pairs (e.g. PCl5).",
          D: "Incorrect. sp? gives only 3 electron domains.",
        },
        difficulty: "medium", neetYear: "2023", topic: "Hybridisation and VSEPR", questionType: "conceptual",
      },
    };

    if (samples[chapterCode]) return samples[chapterCode];

    return {
      questionId: `${chapterCode}_SAMPLE`,
      questionText: `This is a sample NEET-style question for ${chap?.title ?? chapterCode}. The actual question bank is being loaded. Which of the following correctly describes a key concept in ${topic}?`,
      options: {
        A: "Option A ? Study this chapter in NCERT Class " + (chap?.ncertClass ?? "11"),
        B: "Option B ? Focus on " + (chap?.highYieldTags[0] ?? "core concepts"),
        C: "Option C ? Practice previous year questions",
        D: "Option D ? Review worked examples with MEERA",
      },
      correctOption: "C",
      explanation: `For ${chap?.title ?? chapterCode}, practising previous year questions is most effective. This chapter has appeared ~${chap?.avgQuestionsPerYear ?? 3} times per year in NEET.`,
      difficulty: "easy",
      topic,
      questionType: "conceptual",
    };
  }

  function handleOptionSelect(opt: MCQOption) {
    if (session.isAnswered) return;
    const q = session.currentQuestion!;
    const correct = opt === q.correctOption;
    const newScore = session.score + (correct ? NEET_EXAM_CONFIG.markPerCorrect : NEET_EXAM_CONFIG.negativeMarkPerWrong);

    // -- Save attempt to DB --
    const sessionKey = typeof window !== "undefined" ? localStorage.getItem("meera_session_key") : null;
    if (sessionKey) {
      fetch("/api/neet/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: sessionKey,
          sessionType: "practice",
          attempts: [{
            questionId: q.questionId,
            chapterCode: session.chapterCode,
            subject: session.subject,
            selectedOption: opt,
            correctOption: q.correctOption,
            isCorrect: correct,
            timeTakenSec: Math.max(1, session.elapsedSec) // rough approximation
          }]
        })
      }).catch(console.error);
    }
    // ------------------------

    setSession((prev) => ({
      ...prev,
      selectedOption: opt,
      isAnswered: true,
      isCorrect: correct,
      score: newScore,
      correct: correct ? prev.correct + 1 : prev.correct,
      wrong: !correct ? prev.wrong + 1 : prev.wrong,
      questionsAttempted: prev.questionsAttempted + 1,
      phase: "feedback",
      meeraMessage: correct
        ? pickRandom(MEERA_MESSAGES.correct)
        : prev.wrong >= 2
        ? pickRandom(MEERA_MESSAGES.encouragement)
        : pickRandom(MEERA_MESSAGES.wrong),
      meeraEmotion: correct ? "celebrating" : prev.wrong >= 2 ? "empathetic" : "encouraging",
      history: [
        ...prev.history,
        { questionId: q.questionId, selected: opt, correct: q.correctOption, isCorrect: correct },
      ],
      answeredQuestions: [...prev.answeredQuestions, q.questionId],
      elapsedSec: 0, // reset timer for next question
    }));
  }

  function handleSkip() {
    setSession((prev) => ({
      ...prev,
      skipped: prev.skipped + 1,
      questionsAttempted: prev.questionsAttempted + 1,
      meeraMessage: "Skipped. It's okay ? come back to this after finishing the chapter.",
      meeraEmotion: "neutral",
    }));
    loadNextQuestion();
  }

  function handleChapterSwitch(chapterCode: string) {
    const ch = CHAPTER_BY_CODE[chapterCode];
    if (!ch) return;
    setSession((prev) => ({
      ...prev,
      subject: ch.subject,
      chapterCode,
      sessionId: null,
      answeredQuestions: [],
    }));
    setSidebarOpen(false);
  }

  const subjectColor = subjectConfig?.color ?? "#8B5CF6";

  return (
    <div style={{
      background: "#030712", minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif", color: "#F8FAFC",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 99px; }
      `}</style>

      {/* Top bar */}
      <div style={{
        background: "#0F172A", borderBottom: "1px solid #1E293B",
        padding: "0 20px", display: "flex", alignItems: "center",
        height: 52, gap: 14, position: "sticky", top: 0, zIndex: 50,
      }}>
        {/* Hamburger (mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "none", border: "none", color: "#64748b",
            fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center",
          }}
        >
          ?
        </button>

        <a href="/ai-tutor/neet" style={{ color: "#64748b", fontSize: 12, textDecoration: "none" }}>
          ? Subjects
        </a>
        <span style={{ color: "#1E293B" }}>?</span>
        <span style={{ color: subjectColor, fontWeight: 600, fontSize: 13 }}>
          {subjectConfig?.emoji} {subjectConfig?.label}
        </span>
        <span style={{ color: "#1E293B" }}>?</span>
        <span style={{ color: "#94A3B8", fontSize: 13, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {chapter?.title ?? session.chapterCode}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#64748b", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
            ? {formatTime(session.elapsedSec)}
          </span>
          <span style={{
            fontWeight: 800, fontSize: 14,
            color: session.score >= 0 ? "#10B981" : "#EF4444",
          }}>
            {session.score >= 0 ? "+" : ""}{session.score} pts
          </span>
          <span style={{ color: "#64748b", fontSize: 12 }}>
            {session.correct}? {session.wrong}?
          </span>
        </div>
      </div>

      {/* 3-panel body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left sidebar */}
        <div style={{
          width: sidebarOpen ? 260 : 0,
          minWidth: sidebarOpen ? 260 : 0,
          overflow: "hidden",
          background: "#0F172A", borderRight: "1px solid #1E293B",
          transition: "all 0.25s ease",
          display: "flex", flexDirection: "column",
          position: "sticky", top: 52, height: "calc(100vh - 52px)",
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E293B", fontSize: 12, fontWeight: 700, color: "#64748b" }}>
            ALL CHAPTERS
          </div>
          <ChapterSidebar
            activeChapterCode={session.chapterCode}
            subject={session.subject}
            studentClass={studentClass}
            onChapterSelect={handleChapterSwitch}
          />
        </div>

        {/* Center ? main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", maxWidth: 680, margin: "0 auto" }}>

          {/* MEERA message bar */}
          <div style={{
            background: "#0F172A", border: `1px solid ${subjectColor}30`,
            borderRadius: 14, padding: "14px 18px",
            display: "flex", alignItems: "flex-start", gap: 14,
            marginBottom: 18, animation: "fadeIn 0.3s ease",
          }}>
            <MeeraAvatarLarge emotion={session.meeraEmotion} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#6D28D9", fontWeight: 700, marginBottom: 3, display: "flex", justifyContent: "space-between" }}>
                <span>MEERA ? NEET TUTOR</span>
                <button
                  onClick={async () => {
                    try {
                      // Attempt Sarvam API via our Next.js edge Route
                      const res = await fetch("/api/voice/tts", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: session.meeraMessage, avatarId: "meera" }),
                      });
                      const data = await res.json();
                      if (data.audioBase64) {
                        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
                        audio.play();
                      } else if (data.fallback === "speechSynthesis") {
                        const u = new SpeechSynthesisUtterance(session.meeraMessage);
                        u.lang = "en-IN";
                        window.speechSynthesis.speak(u);
                      }
                    } catch (e) {
                      console.error("TTS error", e);
                    }
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
                  title="Listen"
                >
                  🔊 Listen
                </button>
              </div>
              <div style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.6 }}>
                {session.meeraMessage}
              </div>
            </div>
          </div>

          {/* Chapter Overview ? Intro Phase */}
          {session.phase === "intro" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {chapterContent ? (
                <ChapterOverview
                  content={chapterContent}
                  ncertLines={ncertLines}
                  subjectColor={subjectColor}
                  onStart={handleStartPractising}
                  chapterCode={session.chapterCode}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${subjectColor}30`, borderTopColor: subjectColor, animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                  <div style={{ color: "#64748b", fontSize: 14 }}>Loading chapter...</div>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {session.phase === "loading" && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: `3px solid ${subjectColor}30`,
                borderTopColor: subjectColor,
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }} />
              <div style={{ color: "#64748b", fontSize: 14 }}>Loading question...</div>
            </div>
          )}

          {/* Question */}
          {(session.phase === "question" || session.phase === "feedback") && session.currentQuestion && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              {/* Negative marking nudge */}
              {!session.isAnswered && session.wrong >= 1 && (
                <div style={{
                  background: "#1C0A0A", border: "1px solid #B45309",
                  borderRadius: 8, padding: "8px 14px",
                  fontSize: 12, color: "#FCD34D", marginBottom: 10,
                }}>
                  ?? {MEERA_MESSAGES.negative_warning}
                </div>
              )}

              <MCQCard
                question={session.currentQuestion}
                selectedOption={session.selectedOption}
                isAnswered={session.isAnswered}
                isCorrect={session.isCorrect}
                onSelect={handleOptionSelect}
                subject={session.subject}
              />

              {/* Feedback */}
              {session.isAnswered && session.selectedOption && (
                <>
                  <FeedbackBlock
                    question={session.currentQuestion}
                    isCorrect={session.isCorrect!}
                    selectedOption={session.selectedOption}
                    showAll={session.showAllExplanations}
                    onToggleAll={() => setSession((p) => ({ ...p, showAllExplanations: !p.showAllExplanations }))}
                    subject={session.subject}
                  />
                  <DoubtChat question={session.currentQuestion} subjectColor={subjectColor} />
                </>
              )}

              {/* Reference Diagrams */}
              {chapter?.diagrams && chapter.diagrams.length > 0 && (
                <DiagramBlock diagrams={chapter.diagrams} subjectColor={subjectColor} />
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {!session.isAnswered ? (
                  <button
                    onClick={handleSkip}
                    style={{
                      background: "none", border: "1px solid #1E293B",
                      color: "#64748b", borderRadius: 8, padding: "10px 20px",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >
                    Skip ?
                  </button>
                ) : (
                  <button
                    onClick={loadNextQuestion}
                    style={{
                      flex: 1, background: subjectConfig?.bgGradient ?? "#6D28D9",
                      border: "none", color: "#fff", borderRadius: 10,
                      padding: "12px 24px", fontSize: 14, fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Next Question ?
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Session stats footer */}
          {session.questionsAttempted > 0 && (
            <div style={{
              marginTop: 24, padding: "14px 18px",
              background: "#0F172A", border: "1px solid #1E293B",
              borderRadius: 12, display: "flex", justifyContent: "space-around",
              fontSize: 12, animation: "fadeIn 0.4s ease",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981" }}>{session.correct}</div>
                <div style={{ color: "#64748b" }}>Correct</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#EF4444" }}>{session.wrong}</div>
                <div style={{ color: "#64748b" }}>Wrong (-{session.wrong})</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#F59E0B" }}>{session.skipped}</div>
                <div style={{ color: "#64748b" }}>Skipped</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: subjectColor }}>{session.score}</div>
                <div style={{ color: "#64748b" }}>Net Score</div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{
          width: 280, flexShrink: 0,
          padding: "16px 14px",
          overflowY: "auto",
          background: "#030712",
          borderLeft: "1px solid #1E293B",
          position: "sticky", top: 52, height: "calc(100vh - 52px)",
          display: "none",
        }}
          className="neet-right-sidebar"
        >
          <RightSidebar session={session} chapter={chapter} />
        </div>
      </div>

      {/* Right sidebar visible on larger screens via inline style override */}
      <style>{`
        @media (min-width: 1024px) {
          .neet-right-sidebar { display: block !important; }
        }
        @media (min-width: 768px) {
          .neet-left-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
}
