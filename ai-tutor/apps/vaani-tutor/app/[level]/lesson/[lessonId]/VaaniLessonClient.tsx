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
import { vaaniLevel2Data, LEVEL_2_ROMAN_MAP } from "@/lib/vaaniLevel2Data";
import VaaniMatraComparison from "@/components/Vaani/VaaniMatraComparison";
import VaaniMatraTracer from "@/components/Vaani/VaaniMatraTracer";
import { vaaniLevel3Data, LEVEL_3_ROMAN_MAP } from "@/lib/vaaniLevel3Data";
import VaaniConjunctComparison from "@/components/Vaani/VaaniConjunctComparison";
import VaaniConjunctRecognition from "@/components/Vaani/VaaniConjunctRecognition";
import VaaniConjunctScribe from "@/components/Vaani/VaaniConjunctScribe";
import { LEVEL_4_ROMAN_MAP } from "@/lib/vaaniLevel4Data";
import { LEVEL_5_ROMAN_MAP } from "@/lib/vaaniLevel5Data";
import { LEVEL_6_ROMAN_MAP } from "@/lib/vaaniLevel6Data";
import VaaniBarakhadiGrid from "@/components/Vaani/VaaniBarakhadiGrid";
import VaaniSentenceReader from "@/components/Vaani/VaaniSentenceReader";
import VaaniGrammarExplainer from "@/components/Vaani/VaaniGrammarExplainer";
import { LanguageSelector } from "@/components/LanguageSelector";

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

function BoardPanel({ step, boardKey, onTraceComplete, onMatchComplete, onSpeak, lessonLevel, lessonBaseChar, lessonMatra, lessonConsonant1, lessonConsonant2, lessonCombined, lessonHalantForm, lesson }: { step: any; boardKey: number; onTraceComplete?: () => void; onMatchComplete?: () => void; onSpeak?: (text: string) => void; lessonLevel?: number; lessonBaseChar?: string | null; lessonMatra?: string | null; lessonConsonant1?: string | null; lessonConsonant2?: string | null; lessonCombined?: string | null; lessonHalantForm?: string | null; lesson?: any }) {
  const { data, type } = step.board;
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // Matching pairs state
  const [matchLeft, setMatchLeft] = useState<string | null>(null);   // selected left item key
  const [matchRight, setMatchRight] = useState<string | null>(null); // selected right item key
  const [matched, setMatched] = useState<Set<string>>(new Set());    // set of matched left keys
  const [wrongPair, setWrongPair] = useState<string | null>(null);   // flash red on mismatch
  const [rightItems, setRightItems] = useState<string[]>([]);        // shuffled right items

  useEffect(() => {
    setFlippedCards({});
    setSelectedOption(null);
    setMatchLeft(null);
    setMatchRight(null);
    setMatched(new Set());
    setWrongPair(null);
    // Shuffle the right-side items on mount / step change
    if (type === "matchingPairs" && data.pairs) {
      const shuffled = [...data.pairs.map((p: any) => p.right)].sort(() => Math.random() - 0.5);
      setRightItems(shuffled);
    }
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
          {lessonLevel === 3 ? (
            <VaaniConjunctRecognition
              conjunct={lessonCombined || "क्त"}
              sound={(lesson as any)?.combinedSoundRoman || "kta"}
              exampleWords={[
                { word: (lesson as any)?.wordHindi || "युक्त", english: (lesson as any)?.wordEnglish || "Combined" },
              ]}
              onRecognize={onTraceComplete}
            />
          ) : lessonLevel === 2 ? (
            // Level 2: Use VaaniMatraTracer for matra tracing
            <>
              <div style={{
                display: "flex", gap: 10, alignItems: "center",
                padding: "10px 14px", borderRadius: 14,
                background: "rgba(124,58,237,0.08)",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#7c3aed" }}>Trace the matra mark</div>
                  <div style={{ fontSize: 12, color: COLORS.soft }}>Careful tracing builds perfect handwriting.</div>
                </div>
                <div style={{
                  minWidth: 52, height: 52, borderRadius: 16,
                  background: "white", color: "#7c3aed",
                  display: "grid", placeItems: "center",
                  fontSize: 32, fontWeight: 900,
                  border: "1px solid rgba(124,58,237,0.2)",
                }}>
                  {lessonMatra || "ा"}
                </div>
              </div>
              <VaaniMatraTracer
                matra={lessonMatra || "ा"}
                baseChar={lessonBaseChar || "क"}
                onTraceComplete={onTraceComplete}
                completionThreshold={80}
              />
            </>
          ) : (
            // Level 1: Use VaaniTraceCanvas for character tracing
            <>
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
            </>
          )}
        </div>
      )}

      {/* ── Level 4: Barakhadi Grid ── */}
      {type === "flashcards" && lessonLevel === 4 && data.expression === "barakhadi_grid" && (
        <VaaniBarakhadiGrid
          consonant={(lesson as any)?.consonant || "क"}
          consonantRoman={(lesson as any)?.consonantRoman || "k"}
          barakhadiRow={(lesson as any)?.barakhadiRow || []}
          onCellClick={(cell) => {
            console.log(`[Vaani-L4] Barakhadi tap: ${cell.syllable} (${cell.sound})`);
            onSpeak?.(cell.syllable);
          }}
        />
      )}

      {/* ── Level 5: Sentence Reader ── */}
      {type === "flashcards" && lessonLevel === 5 && data.expression === "sentence_reader" && (
        <VaaniSentenceReader
          sentence={(lesson as any)?.sentence || ""}
          sentenceRoman={(lesson as any)?.sentenceRoman || ""}
          sentenceEnglish={(lesson as any)?.sentenceEnglish || ""}
          words={(lesson as any)?.words || []}
          onWordClick={(word) => {
            console.log(`[Vaani-L5] Word tap: ${word.hindi}`);
            onSpeak?.(word.hindi);
          }}
          onSentenceClick={() => {
            onSpeak?.((lesson as any)?.sentence || "");
          }}
        />
      )}

      {/* ── Level 6: Grammar Explainer ── */}
      {type === "flashcards" && lessonLevel === 6 && data.expression === "grammar_explainer" && (
        <VaaniGrammarExplainer
          grammarTopic={(lesson as any)?.grammarTopic || "Grammar Topic"}
          grammarTopicHindi={(lesson as any)?.grammarTopicHindi || "व्याकरण"}
          ruleExplanation={(lesson as any)?.ruleExplanation || ""}
          ruleExplanationHindi={(lesson as any)?.ruleExplanationHindi || ""}
          exampleSentenceHindi={(lesson as any)?.exampleSentenceHindi || ""}
          exampleSentenceRoman={(lesson as any)?.exampleSentenceRoman || ""}
          exampleSentenceEnglish={(lesson as any)?.exampleSentenceEnglish || ""}
          practiceExamples={(lesson as any)?.practiceExamples || []}
          commonMistakes={(lesson as any)?.commonMistakes || []}
          transformationExercises={(lesson as any)?.transformationExercises || []}
          mcqQuestions={(lesson as any)?.mcqQuestions || []}
          onSpeak={onSpeak}
        />
      )}

      {type === "flashcards" && lessonLevel === 3 && data.expression === "conjunct_comparison" && (
        // Level 3 Step 1: Show conjunct transformation (consonant1 + consonant2 = combined)
        <VaaniConjunctComparison
          consonant1={lessonConsonant1 || "क"}
          consonant1Sound={(lesson as any)?.consonant1SoundRoman || "k"}
          consonant2={lessonConsonant2 || "त"}
          consonant2Sound={(lesson as any)?.consonant2SoundRoman || "ta"}
          combined={lessonCombined || "क्त"}
          combinedSound={(lesson as any)?.combinedSoundRoman || "kta"}
          halantForm={lessonHalantForm || "क्"}
          exampleWord={(lesson as any)?.wordHindi || "युक्त"}
          exampleWordEnglish={(lesson as any)?.wordEnglish || "Combined"}
          onAudioPlay={onSpeak}
        />
      )}

      {type === "flashcards" && lessonLevel === 2 && data.expression === "matra_comparison" && (
        // Level 2 Step 1: Show matra transformation (base + matra = modified)
        <VaaniMatraComparison
          baseChar={lessonBaseChar || "क"}
          baseSoundRoman={(lesson as any)?.baseSoundRoman || "k"}
          matra={lessonMatra || "ा"}
          matraSoundRoman={(lesson as any)?.matraSoundRoman || "aa"}
          modifiedChar={data.expression === "matra_comparison" ? (lesson as any)?.modifiedChar || "का" : "का"}
          modifiedSoundRoman={(lesson as any)?.modifiedSoundRoman || "kaa"}
          onBaseCharClick={() => {
            console.log('[Vaani-L2] User clicked base character');
            onSpeak?.(`${lessonBaseChar || "क"}`);
          }}
          onMatraClick={() => {
            console.log('[Vaani-L2] User clicked matra');
            onSpeak?.(`${lessonMatra || "ा"} effect`);
          }}
          onResultClick={() => {
            console.log('[Vaani-L2] User clicked modified character');
            onSpeak?.((lesson as any)?.modifiedChar || "का");
          }}
          showAnimationOnLoad={true}
        />
      )}

      {type === "flashcards" &&
       data.expression !== "matra_comparison" &&
       data.expression !== "conjunct_comparison" &&
       data.expression !== "barakhadi_grid" &&
       data.expression !== "sentence_reader" &&
       data.cards && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {data.cards.map((card: any, index: number) => {
            const flipped = !!flippedCards[index];
            // Support both old (front/back strings) and new (emoji/word/english) card format
            const cardEmoji = card.emoji || card.front?.split(" ")[0] || "📖";
            const cardWord = card.word || card.front?.split(" ").slice(1).join(" ") || card.front;
            const cardEnglish = card.english || card.back || "";
            return (
              <button
                key={`${card.front}-${index}`}
                onClick={() => {
                  const wasFlipped = !!flippedCards[index];
                  setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
                  // Speak when flipping to reveal (front → back)
                  if (!wasFlipped && onSpeak) {
                    onSpeak(`${cardWord}! ${cardEnglish ? "That means " + cardEnglish + "!" : ""}`);
                  }
                }}
                style={{
                  height: 200,
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
                  {/* FRONT — big emoji + Hindi word */}
                  <div
                    style={{
                      position: "absolute", inset: 0, backfaceVisibility: "hidden",
                      borderRadius: 24,
                      background: "linear-gradient(135deg, #fff7ed, #ffffff)",
                      border: "1px solid rgba(249,115,22,0.20)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      padding: 14, gap: 8,
                    }}
                  >
                    <div style={{ fontSize: 60, lineHeight: 1 }}>{cardEmoji}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.orange, textAlign: "center" }}>
                      {cardWord}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.soft, fontWeight: 700 }}>
                      🔊 Tap to hear!
                    </div>
                  </div>
                  {/* BACK — English meaning + Hindi word */}
                  <div
                    style={{
                      position: "absolute", inset: 0, backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderRadius: 24,
                      background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
                      border: "2px solid rgba(16,185,129,0.30)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      padding: 14, gap: 6, textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 48, lineHeight: 1 }}>{cardEmoji}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#047857" }}>
                      {cardEnglish}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.orange }}>
                      {cardWord}
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.blue, fontWeight: 800, letterSpacing: 0.5 }}>
                      starts with {data.headline?.split(" ").slice(-1)[0] || "?"}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {type === "mcq" && data.options && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
          {data.options.map((option: string) => {
            const selected = option === selectedOption;
            const correct = selected && option === data.answer;
            const wrong = selected && option !== data.answer;
            // Split "🍎 अनार" → emoji + word; or just a letter like "अ"
            const parts = option.split(" ");
            const hasEmoji = parts.length > 1 && /\p{Emoji}/u.test(parts[0]);
            const emojiPart = hasEmoji ? parts[0] : "";
            const wordPart = hasEmoji ? parts.slice(1).join(" ") : option;
            return (
              <button
                key={option}
                onClick={() => setSelectedOption(option)}
                style={{
                  padding: "16px 10px",
                  borderRadius: 20,
                  cursor: "pointer",
                  border: correct
                    ? "3px solid rgba(16,185,129,0.60)"
                    : wrong
                      ? "3px solid rgba(239,68,68,0.50)"
                      : selected
                        ? "2px solid rgba(59,130,246,0.40)"
                        : `1px solid ${COLORS.line}`,
                  background: correct ? "rgba(16,185,129,0.12)" : wrong ? "rgba(239,68,68,0.08)" : "white",
                  color: COLORS.ink,
                  fontWeight: 800,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: hasEmoji ? 8 : 4,
                  position: "relative", minHeight: hasEmoji ? 110 : 72,
                  transition: "all 0.15s ease",
                }}
              >
                {hasEmoji ? (
                  <>
                    <span style={{ fontSize: 44, lineHeight: 1 }}>{emojiPart}</span>
                    <span style={{ fontSize: 16, fontWeight: 900, textAlign: "center" }}>{wordPart}</span>
                  </>
                ) : (
                  <span style={{ fontSize: wordPart.length > 2 ? 26 : 42, fontWeight: 900 }}>{wordPart}</span>
                )}
                {(correct || wrong) && (
                  <span style={{
                    position: "absolute", top: 6, right: 8,
                    fontSize: 16, fontWeight: 900,
                    color: correct ? "#10b981" : "#ef4444",
                  }}>
                    {correct ? "✓" : "✕"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {type === "matchingPairs" && data.pairs && (() => {
        const pairs: Array<{ left: string; right: string }> = data.pairs;
        const allMatched = matched.size === pairs.length;

        const handleLeft = (leftKey: string) => {
          if (matched.has(leftKey)) return;
          setMatchLeft(leftKey);
          setMatchRight(null);
        };

        const handleRight = (rightVal: string) => {
          if (!matchLeft) return;
          // find what the correct right for matchLeft is
          const correctRight = pairs.find(p => p.left === matchLeft)?.right;
          if (rightVal === correctRight) {
            const next = new Set(matched);
            next.add(matchLeft);
            setMatched(next);
            setMatchLeft(null);
            setMatchRight(null);
            if (next.size === pairs.length) {
              // tiny delay so student sees the last pair go green before callback
              setTimeout(() => onMatchComplete?.(), 600);
            }
          } else {
            setWrongPair(matchLeft);
            setTimeout(() => { setWrongPair(null); setMatchLeft(null); }, 700);
          }
        };

        return (
          <div>
            {allMatched && (
              <div style={{
                background: "rgba(16,185,129,0.12)", border: "2px solid #10b981",
                borderRadius: 16, padding: "12px 18px", marginBottom: 14,
                textAlign: "center", fontWeight: 900, color: "#047857", fontSize: 17,
                animation: "vn-bounce 0.4s ease",
              }}>
                🌟 Perfect match! All pairs found!
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* LEFT column — picture/emoji cards */}
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: COLORS.soft, textTransform: "uppercase", letterSpacing: 1, textAlign: "center", marginBottom: 2 }}>
                  Picture
                </div>
                {pairs.map((pair) => {
                  const isMatched = matched.has(pair.left);
                  const isSelected = matchLeft === pair.left;
                  const isWrong = wrongPair === pair.left;
                  return (
                    <button
                      key={pair.left}
                      onClick={() => handleLeft(pair.left)}
                      disabled={isMatched}
                      style={{
                        padding: "14px 10px", borderRadius: 16,
                        border: isMatched ? "2px solid #10b981"
                          : isSelected ? "2px solid #7c3aed"
                          : isWrong ? "2px solid #ef4444"
                          : `1px solid ${COLORS.line}`,
                        background: isMatched ? "rgba(16,185,129,0.10)"
                          : isSelected ? "rgba(124,58,237,0.10)"
                          : isWrong ? "rgba(239,68,68,0.10)"
                          : "white",
                        cursor: isMatched ? "default" : "pointer",
                        fontWeight: 900, fontSize: 38, color: isMatched ? "#10b981" : COLORS.ink,
                        transition: "all 0.15s ease",
                        animation: isWrong ? "vn-shake 0.4s ease" : "none",
                        lineHeight: 1.2,
                      }}
                    >
                      {isMatched ? <span style={{ fontSize: 20 }}>✓ {pair.left}</span> : pair.left}
                    </button>
                  );
                })}
              </div>

              {/* RIGHT column — shuffled */}
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: COLORS.soft, textTransform: "uppercase", letterSpacing: 1, textAlign: "center", marginBottom: 2 }}>
                  Word
                </div>
                {rightItems.map((rightVal) => {
                  const isMatched = pairs.some(p => p.right === rightVal && matched.has(p.left));
                  const isSelected = matchRight === rightVal;
                  return (
                    <button
                      key={rightVal}
                      onClick={() => handleRight(rightVal)}
                      disabled={isMatched || !matchLeft}
                      style={{
                        padding: "12px 10px", borderRadius: 16,
                        border: isMatched ? "2px solid #10b981"
                          : isSelected ? "2px solid #7c3aed"
                          : `1px solid ${COLORS.line}`,
                        background: isMatched ? "rgba(16,185,129,0.10)"
                          : isSelected ? "rgba(124,58,237,0.10)"
                          : matchLeft ? "rgba(124,58,237,0.04)"
                          : "white",
                        cursor: isMatched || !matchLeft ? "default" : "pointer",
                        fontWeight: 700, fontSize: 14, color: isMatched ? "#047857" : COLORS.ink,
                        transition: "all 0.15s ease",
                        lineHeight: 1.3,
                        opacity: !matchLeft && !isMatched ? 0.65 : 1,
                      }}
                    >
                      {isMatched ? "✓ " : ""}{rightVal}
                    </button>
                  );
                })}
              </div>
            </div>
            {!allMatched && matchLeft && (
              <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: "#7c3aed", fontWeight: 800, animation: "vn-pulse 1.5s ease-in-out infinite" }}>
                ✨ Now tap the matching word →
              </div>
            )}
            {!allMatched && !matchLeft && (
              <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: COLORS.soft, fontWeight: 700 }}>
                👈 Tap a word on the left to start matching!
              </div>
            )}
            <style>{`
              @keyframes vn-shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-6px); }
                40% { transform: translateX(6px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
              }
            `}</style>
          </div>
        );
      })()}

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
  // Visual-step mic invite — shown on "Look and Listen" steps after Vaani speaks
  const [visualMicVisible, setVisualMicVisible] = useState(false);
  const [visualMicDone, setVisualMicDone] = useState(false);
  // Camera scan — optional handwriting check after tracing
  const [showCamera, setShowCamera] = useState(false);
  const [cameraUsed, setCameraUsed] = useState(false);
  // Match the Pair completion
  const [matchDone, setMatchDone] = useState(false);
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

  // Detect lesson level from lesson.id prefix
  const lessonLevel = (() => {
    const id = (payload.lesson as any).id || '';
    if (id.startsWith('L6-')) return 6;
    if (id.startsWith('L5-')) return 5;
    if (id.startsWith('L4-')) return 4;
    if (id.startsWith('L3-')) return 3;
    if (id.startsWith('L2-')) return 2;
    return 1;
  })();

  console.log(`[Vaani] Loaded lesson ${(payload.lesson as any).id} - Level ${lessonLevel}`);

  // Extract level-specific lesson data
  const lessonChar = lessonLevel === 2
    ? (payload.lesson as any).modifiedChar || "का"   // For Level 2, display the matra-modified character
    : lessonLevel === 4
    ? (payload.lesson as any).consonant || "क"       // For Level 4, display consonant
    : lessonLevel === 5
    ? (payload.lesson as any).firstWord || ""        // For Level 5, display first word
    : lessonLevel === 6
    ? (payload.lesson as any).grammarTopic || ""      // For Level 6, display grammar topic
    : (payload.lesson as any).char || "अ";            // For Level 1 & 3, display the base character

  // Level 2-specific fields (null for Level 1)
  const lessonBaseChar = lessonLevel === 2
    ? (payload.lesson as any).baseChar || "क"         // Base consonant (e.g., "क")
    : null;

  const lessonMatra = lessonLevel === 2
    ? (payload.lesson as any).matra || "ा"            // Matra mark (e.g., "ा")
    : null;

  // Level 3-specific fields (null for Levels 1 & 2)
  const lessonConsonant1 = lessonLevel === 3
    ? (payload.lesson as any).consonant1 || "क"         // First consonant (e.g., "क")
    : null;

  const lessonConsonant2 = lessonLevel === 3
    ? (payload.lesson as any).consonant2 || "त"         // Second consonant (e.g., "त")
    : null;

  const lessonCombined = lessonLevel === 3
    ? (payload.lesson as any).combinedChar || "क्त"     // Combined conjunct (e.g., "क्त")
    : null;

  const lessonHalantForm = lessonLevel === 3
    ? (payload.lesson as any).halantForm || "क्"        // First consonant with halant
    : null;

  const lessonWord = (payload.lesson as any).wordHindi || "अनार";
  const lessonWordEng = (payload.lesson as any).wordEnglish || "Pomegranate";
  const lessonAssetPath = (payload.lesson as any).assetPath || "/assets/gemini/placeholder.png";

  // Roman transliteration — extracted from title or lesson data
  // Used in all speech prompts so kids hear/see the Hindi word name, not English translation
  const lessonWordRoman: string = (() => {
    // For Level 4+, check specific romanization fields
    if (lessonLevel === 4) {
      return (payload.lesson as any).wordRoman || lessonWord;
    }
    if (lessonLevel === 5) {
      return (payload.lesson as any).sentenceRoman || lessonWord;
    }
    if (lessonLevel === 6) {
      return (payload.lesson as any).exampleSentenceRoman || lessonWord;
    }

    const title: string = (payload.lesson as any).title || "";
    const afterFor = title.split(" for ")[1]?.trim();
    // For Level 2 & 3, also check wordRoman field
    if (!afterFor && (lessonLevel === 2 || lessonLevel === 3)) {
      return (payload.lesson as any).wordRoman || lessonWord;
    }
    return afterFor || lessonWord; // fallback to Hindi script
  })();

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

  // speakText is fully awaitable — resolves only when playback finishes
  async function speakText(text: string): Promise<void> {
    if (!text) return;
    if (activeAudioRef.current) { activeAudioRef.current.pause(); activeAudioRef.current = null; }

    const nativeUrl = getVaaniAudio(text.trim());
    if (nativeUrl) {
      return new Promise<void>((resolve) => {
        const audio = new Audio(nativeUrl);
        activeAudioRef.current = audio;
        setIsSpeaking(true);
        audio.onended = () => { setIsSpeaking(false); resolve(); };
        audio.onerror = () => { setIsSpeaking(false); resolve(); };
        audio.play().catch(() => { setIsSpeaking(false); resolve(); });
      });
    }

    setIsSpeaking(true);
    try {
      const resp = await fetch("/vaani/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, avatarId: "priya", provider: "edge" }),
      });
      const data = await resp.json();
      if (data.audioBase64) {
        const mime = data.mimeType || "audio/mpeg";
        return new Promise<void>((resolve) => {
          const audio = new Audio(`data:${mime};base64,${data.audioBase64}`);
          activeAudioRef.current = audio;
          audio.onended = () => { setIsSpeaking(false); resolve(); };
          audio.onerror = () => { setIsSpeaking(false); resolve(); };
          audio.play().catch(() => { setIsSpeaking(false); resolve(); });
        });
      } else {
        setIsSpeaking(false);
      }
    } catch {
      setIsSpeaking(false);
    }
  }

  // Speak single letter 3 times with pause — uses Web Speech API (more reliable than external audio files)
  async function speakLetterThrice(char: string): Promise<void> {
    // Use browser's Web Speech API for letter pronunciation (more reliable)
    if (!('speechSynthesis' in window)) {
      console.warn('[Vaani] SpeechSynthesis API not available, falling back to TTS');
      setIsSpeaking(true);
      await speakText(char);
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      let count = 0;

      const speak = () => {
        count++;
        console.log(`[Vaani] Speaking "${char}" (attempt ${count}/3)`);
        window.speechSynthesis.cancel();

        utterance.onstart = () => {
          console.log(`[Vaani] Speech started for "${char}"`);
        };

        utterance.onend = () => {
          console.log(`[Vaani] Speech ended for "${char}" (${count}/3)`);
          if (count < 3) {
            setTimeout(speak, 600);
          } else {
            setIsSpeaking(false);
            console.log(`[Vaani] Completed 3x pronunciation of "${char}"`);
            resolve();
          }
        };

        utterance.onerror = (event) => {
          console.error(`[Vaani] Speech error for "${char}" (${count}/3):`, event.error);
          if (count < 3) {
            setTimeout(speak, 600);
          } else {
            setIsSpeaking(false);
            console.warn(`[Vaani] Speech failed after 3 attempts for "${char}"`);
            resolve();
          }
        };

        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error('[Vaani] Exception while speaking:', err);
          setIsSpeaking(false);
          resolve();
        }
      };

      speak();
    });
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

  // Auto-speak welcome — sequences: intro → letter × 3 clearly → outro
  // speakText is now awaitable so each part waits for the previous to finish
  useEffect(() => {
    if (!nameAsked) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      if (cancelled) return;
      // Part 1: intro up to the dash
      const intro = vaaniSay(
        `नमस्ते ${studentName}! आज हम सीखेंगे —`,
        `नमस्ते ${studentName}! Today we learn —`,
        `Hello ${studentName}! Today's letter is —`,
        `Hello ${studentName}! I'm Vaani! Today's letter is —`,
      );
      await speakText(intro);
      if (cancelled) return;
      // Part 2: letter spoken 3× from pre-recorded audio (loud & clear)
      await new Promise(r => setTimeout(r, 250));
      await speakLetterThrice(lessonChar);
      if (cancelled) return;
      // Part 3: outro with the word
      await new Promise(r => setTimeout(r, 350));
      const outro = vaaniSay(
        `${lessonWord} में है! नीचे अक्षर दबाओ! 🎵`,
        `it's in ${lessonWord}! Tap the letter below! 🎵`,
        `it's in the word ${lessonWordRoman}! Tap it below! 🎵`,
        `it starts the word ${lessonWordRoman}! Tap it below! 🎵`,
      );
      await speakText(outro);
    }, 900);
    return () => { cancelled = true; clearTimeout(t); };
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

  // Reset all per-step state when step changes
  useEffect(() => {
    setVoiceCheckVisible(false);
    setVoiceCheckPassed(false);
    setShowCamera(false);
    setCameraUsed(false);
    setVisualMicVisible(false);
    setVisualMicDone(false);
    setMatchDone(false);
  }, [stepIndex]);

  // Speak lesson step when session starts
  useEffect(() => {
    if (sessionActive && currentStep) {
      setBoardKey((value) => value + 1);
      void speakText(currentStep.tutorText);
    }
  }, [currentStep, sessionActive]);

  // ── VISUAL STEP MIC INVITE — auto-show after Vaani speaks on "visual" steps ──
  useEffect(() => {
    if (!sessionActive || currentStep?.board?.type !== "visual") return;
    // Wait 3.5 s (Vaani speaks ~2-3s), then invite student to speak back
    const t = setTimeout(() => {
      setVisualMicVisible(true);
      void speakText(vaaniSay(
        `अब तुम बोलो ${studentName}: ${lessonWord}! माइक दबाओ! 🎙️`,
        `Now you say it ${studentName}: ${lessonWord}! Press the mic! 🎙️`,
        `Your turn ${studentName}! Press mic and say: ${lessonWordRoman}! 🎙️`,
        `Press the mic and say: ${lessonWordRoman}! Can you do it ${studentName}? 🎙️`,
      ));
    }, 3500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {lessonChar} for {lessonWordRoman} &nbsp;·&nbsp; ({lessonWordEng})
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
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <LanguageSelector />
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
                          `Yay ${studentName}! You love ${lessonWordRoman}! Now let's learn ${lessonChar}! 🎉`,
                          `That's great ${studentName}! ${lessonWordRoman} is delicious! The letter ${lessonChar} starts this word! Let's learn it! 🎉`,
                        )
                      : fruitLiked === false
                        ? vaaniSay(
                            `कोई बात नहीं ${studentName}! एक दिन ज़रूर खाना! चलो ${lessonChar} सीखते हैं! 🍎`,
                            `No worries ${studentName}! Maybe try ${lessonWord} someday! चलो ${lessonChar} सीखते हैं! 🍎`,
                            `No worries! Maybe try ${lessonWordRoman} someday! Now let's learn letter ${lessonChar}! 🍎`,
                            `That's okay ${studentName}! ${lessonWordRoman} is yummy — try it someday! Now, let's learn the letter ${lessonChar}! 🍎`,
                          )
                        : vaaniSay(
                            `नमस्ते ${studentName}! आज हम ${lessonChar} सीखेंगे — जैसे ${lessonWord}! नीचे का अक्षर दबाओ! 🎵`,
                            `नमस्ते ${studentName}! Today we learn ${lessonChar} — like in ${lessonWord}! Tap the letter below! 🎵`,
                            `Hello ${studentName}! Today's letter is ${lessonChar} — it's in the word ${lessonWordRoman}! Tap it below! 🎵`,
                            `Hi ${studentName}! I'm Vaani! Today we learn the Hindi letter ${lessonChar}. It sounds like 'a' in ${lessonWordRoman}! Tap it below! 🎵`,
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
                onSpeak={speakText}
                romanMap={lessonLevel === 6 ? LEVEL_6_ROMAN_MAP : lessonLevel === 5 ? LEVEL_5_ROMAN_MAP : lessonLevel === 4 ? LEVEL_4_ROMAN_MAP : lessonLevel === 3 ? LEVEL_3_ROMAN_MAP : lessonLevel === 2 ? LEVEL_2_ROMAN_MAP : undefined}
                lessonLevel={lessonLevel}
                lessonBaseChar={lessonBaseChar}
                lessonMatra={lessonMatra}
                lessonConsonant1={lessonConsonant1}
                lessonConsonant2={lessonConsonant2}
                lessonCombined={lessonCombined}
                lessonHalantForm={lessonHalantForm}
                lesson={payload.lesson}
                onTraceComplete={() => {
                  playSuccessChime();
                  void speakText(vaaniSay(
                    `बहुत बढ़िया! अब बोलो ${studentName}: ${lessonWord}!`,
                    `Great! Now say it ${studentName}: ${lessonWord}!`,
                    `Well done! Now say the word: ${lessonWordRoman}!`,
                    `Wonderful! Now say: ${lessonWordRoman}!`,
                  ));
                  setVoiceCheckVisible(true);
                }}
                onMatchComplete={() => {
                  if (matchDone) return;
                  setMatchDone(true);
                  playSuccessChime();
                  void speakText(vaaniSay(
                    `शाबाश ${studentName}! सभी pairs सही मिलाए! 🌟`,
                    `Wow ${studentName}! All pairs matched perfectly! 🌟`,
                    `Brilliant ${studentName}! You matched everything! 🌟`,
                    `Amazing ${studentName}! All pairs correct! 🌟`,
                  ));
                }}
              />
            )}

            {/* ── MATCH DONE banner ── */}
            {currentStep?.board?.type === "matchingPairs" && matchDone && (
              <div style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))",
                borderRadius: 18, padding: "14px 20px",
                border: "2px solid rgba(16,185,129,0.35)",
                display: "flex", alignItems: "center", gap: 14,
                animation: "vn-bounce 0.4s ease",
              }}>
                <span style={{ fontSize: 28 }}>🏆</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#047857" }}>
                    {vaaniSay(
                      `शाबाश! अब Quiz आगे है →`,
                      `Great! Next up: Quiz! →`,
                      `Well matched! Move on to Quiz →`,
                      `All matched! Continue to Quiz →`,
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginTop: 2 }}>
                    Press "Next step" to test yourself!
                  </div>
                </div>
              </div>
            )}

            {/* ── VISUAL MIC INVITE — appears on "Look and Listen" step after Vaani speaks ── */}
            {currentStep?.board?.type === "visual" && visualMicVisible && !visualMicDone && (
              <VaaniSpeakCheck
                targetChar={lessonChar}
                targetWord={lessonWord}
                targetWordEng={lessonWordEng}
                prompt={vaaniSay(
                  `${studentName}, बोलो मेरे साथ: ${lessonWord}! 🎙️`,
                  `${studentName}, say it with me: ${lessonWord}! 🎙️`,
                  `Can YOU say it? Press 🎙️ and say: "${lessonWord} (${lessonWordRoman})"!`,
                  `Your turn! Press the mic 🎙️ and say: "${lessonWord} (${lessonWordRoman})"!`,
                )}
                studentName={studentName}
                hindiLevel={hindiLevel}
                onPass={(correct) => {
                  setVisualMicDone(true);
                  setVisualMicVisible(false);
                  if (correct) {
                    playSuccessChime();
                    void speakText(vaaniSay(
                      `वाह ${studentName}! एकदम सही! तुम तैयार हो! 🌟`,
                      `Wow ${studentName}! Perfect! अब trace करो! 🌟`,
                      `Brilliant ${studentName}! Now let's trace the letter! 🌟`,
                      `Amazing ${studentName}! Now trace the letter below! 🌟`,
                    ));
                  }
                }}
                onSpeak={speakText}
                romanMap={lessonLevel === 6 ? LEVEL_6_ROMAN_MAP : lessonLevel === 5 ? LEVEL_5_ROMAN_MAP : lessonLevel === 4 ? LEVEL_4_ROMAN_MAP : lessonLevel === 3 ? LEVEL_3_ROMAN_MAP : lessonLevel === 2 ? LEVEL_2_ROMAN_MAP : undefined}
                autoStart={false}
              />
            )}

            {currentStep?.board?.type === "visual" && visualMicDone && (
              <div style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))",
                borderRadius: 18, padding: "14px 20px",
                border: "2px solid rgba(16,185,129,0.35)",
                display: "flex", alignItems: "center", gap: 14,
                animation: "vn-bounce 0.4s ease",
              }}>
                <span style={{ fontSize: 28 }}>🌟</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#047857" }}>
                    {vaaniSay(
                      `शाबाश ${studentName}! अब अक्षर trace करो →`,
                      `Great ${studentName}! Now trace the letter →`,
                      `Well done ${studentName}! Move to tracing →`,
                      `Excellent ${studentName}! Next: trace the letter →`,
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginTop: 2 }}>
                    {vaaniSay("बोलना = सीखना!", "Speaking = Learning!", "Say it → Learn it!", "Say it → Learn it!")}
                  </div>
                </div>
              </div>
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
                  `Now say: "${lessonWord} (${lessonWordRoman})"! Can you? 🎙️`,
                  `Your turn! Say: "${lessonWord} (${lessonWordRoman})"! 🎙️`,
                )}
                studentName={studentName}
                hindiLevel={hindiLevel}
                onPass={(correct) => {
                  setVoiceCheckPassed(true);
                  setVoiceCheckVisible(false);
                  if (correct) playSuccessChime();
                }}
                onSpeak={speakText}
                romanMap={lessonLevel === 6 ? LEVEL_6_ROMAN_MAP : lessonLevel === 5 ? LEVEL_5_ROMAN_MAP : lessonLevel === 4 ? LEVEL_4_ROMAN_MAP : lessonLevel === 3 ? LEVEL_3_ROMAN_MAP : lessonLevel === 2 ? LEVEL_2_ROMAN_MAP : undefined}
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
                romanMap={lessonLevel === 6 ? LEVEL_6_ROMAN_MAP : lessonLevel === 5 ? LEVEL_5_ROMAN_MAP : lessonLevel === 4 ? LEVEL_4_ROMAN_MAP : lessonLevel === 3 ? LEVEL_3_ROMAN_MAP : lessonLevel === 2 ? LEVEL_2_ROMAN_MAP : undefined}
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
                {item.assetPath && (
                  <div
                    style={{
                      background: "linear-gradient(180deg, #fff7ed, #ffffff)",
                      borderRadius: 20,
                      padding: 14,
                      border: "1px solid rgba(249,115,22,0.14)",
                      marginBottom: 18,
                    }}
                  >
                    <img
                      src={item.assetPath.startsWith('/') ? item.assetPath : `/vaani${item.assetPath}`}
                      alt={`${item.word} - ${item.wordEng}`}
                      style={{ width: "100%", maxHeight: 240, objectFit: "contain" }}
                    />
                  </div>
                )}
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
                    `Say: "${item.word}"! 🎙️`,
                    `Can you say: "${item.word}"? 🎙️`,
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
                romanMap={lessonLevel === 6 ? LEVEL_6_ROMAN_MAP : lessonLevel === 5 ? LEVEL_5_ROMAN_MAP : lessonLevel === 4 ? LEVEL_4_ROMAN_MAP : lessonLevel === 3 ? LEVEL_3_ROMAN_MAP : lessonLevel === 2 ? LEVEL_2_ROMAN_MAP : undefined}
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
                markLearned(lessonChar, lessonWord, lessonWordEng, lessonIndex, lessonAssetPath);
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
