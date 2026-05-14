"use client";

import { useState } from "react";
import styles from "./VaaniGrammarExplainer.module.css";

const TOPIC_EMOJI: Record<string, string> = {
  "Common Nouns": "🏷️",        "Proper Nouns": "🗺️",
  "Noun Gender": "⚧️",          "Noun Number": "🔢",
  "Descriptive Adjectives": "🎨","Comparative Adjectives": "⚖️",
  "Superlative Adjectives": "🏆","Other Adjective Types": "✳️",
  "Compound Adjectives": "🔗",   "Adjective Position": "📍",
  "Comprehensive Review": "🌟",  "Infinitive Verbs": "⚡",
  "Present Habitual Tense": "🔄","Present Continuous Tense": "▶️",
  "Future Tense": "🔮",          "Present Perfect Tense": "✅",
  "Imperative Mood": "📢",       "Subject-Verb Agreement": "🤝",
  "Transitive & Intransitive Verbs": "↔️","Verb Tenses Review": "📅",
  "Personal Pronouns": "👤",     "Possessive Pronouns": "🔑",
  "Demonstrative Pronouns": "👆","Interrogative Pronouns": "❓",
  "Reflexive Pronouns": "🪞",    "Case Markers": "🔖",
  "Ne Marker": "✏️",             "Ko Marker": "📌",
  "Se Marker": "🔀",             "Pronouns Review": "👥",
  "Simple Sentences": "📝",      "Compound Sentences": "🔗",
  "Complex Sentences": "🌐",     "Question Sentences": "❓",
  "Negative Sentences": "🚫",    "SOV Word Order": "📐",
  "Sentence Patterns": "🔲",     "Synthesis Review": "🎓",
};

const TOPIC_GRADIENT: Record<string, string> = {
  "Nouns": "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
  "Adjective": "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
  "Verb": "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
  "Pronoun": "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
  "Sentence": "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
  "Review": "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
};

function getTopicGradient(topic: string): string {
  for (const key of Object.keys(TOPIC_GRADIENT)) {
    if (topic.toLowerCase().includes(key.toLowerCase())) return TOPIC_GRADIENT[key];
  }
  return "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";
}

interface PracticeExample {
  hindi: string;
  roman?: string;
  english?: string;
  explanation?: string;
}

interface CommonMistake {
  wrong: string;
  correct: string;
  explanation?: string;
}

interface TransformationExercise {
  instruction: string;
  inputHindi?: string;
  outputHindi?: string;
}

interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface VaaniGrammarExplainerProps {
  grammarTopic: string;
  grammarTopicHindi?: string;
  ruleExplanation?: string;
  ruleExplanationHindi?: string;
  exampleSentenceHindi?: string;
  exampleSentenceRoman?: string;
  exampleSentenceEnglish?: string;
  practiceExamples?: PracticeExample[];
  commonMistakes?: CommonMistake[];
  transformationExercises?: TransformationExercise[];
  mcqQuestions?: MCQQuestion[];
  onSpeak?: (text: string) => void;
}

export default function VaaniGrammarExplainer({
  grammarTopic,
  grammarTopicHindi,
  ruleExplanation,
  ruleExplanationHindi,
  exampleSentenceHindi,
  exampleSentenceRoman,
  exampleSentenceEnglish,
  practiceExamples = [],
  commonMistakes = [],
  transformationExercises = [],
  mcqQuestions = [],
  onSpeak,
}: VaaniGrammarExplainerProps) {
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});

  function handleMcqAnswer(qIdx: number, optIdx: number) {
    setMcqAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  const emoji = TOPIC_EMOJI[grammarTopic] || "📖";
  const gradient = getTopicGradient(grammarTopic);

  return (
    <div className={styles.container}>
      {/* ── Visual Hero Card ── */}
      <div style={{
        background: gradient,
        borderRadius: 28,
        padding: "28px 24px",
        textAlign: "center",
        boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.08), transparent 50%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 12 }}>{emoji}</div>
          {grammarTopicHindi && (
            <div style={{ fontSize: 48, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
              {grammarTopicHindi}
            </div>
          )}
          <div style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: 1, textTransform: "uppercase" }}>
            {grammarTopic}
          </div>
          {exampleSentenceHindi && (
            <button
              onClick={() => onSpeak?.(exampleSentenceHindi)}
              style={{
                marginTop: 18, background: "rgba(255,255,255,0.22)", border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: 16, padding: "12px 20px", cursor: "pointer", width: "100%",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 4 }}>
                {exampleSentenceHindi}
              </div>
              {exampleSentenceEnglish && (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.80)", fontWeight: 600 }}>
                  {exampleSentenceEnglish} · 🔊 tap to hear
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Rule explanation */}
      <div className={styles.ruleBox}>
        <h3 className={styles.ruleTitle}>{grammarTopic}</h3>
        {grammarTopicHindi && <p className={styles.ruleTitleHindi}>{grammarTopicHindi}</p>}
        {ruleExplanation && <p className={styles.ruleText}>{ruleExplanation}</p>}
        {ruleExplanationHindi && <p className={styles.ruleText}>{ruleExplanationHindi}</p>}
      </div>

      {/* Example sentence */}
      {exampleSentenceHindi && (
        <div className={styles.exampleSection}>
          <span className={styles.exampleLabel}>Example</span>
          <button
            onClick={() => onSpeak?.(exampleSentenceHindi)}
            style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%", padding: 0 }}
          >
            <p className={styles.sentenceHindi}>{exampleSentenceHindi}</p>
            {exampleSentenceRoman && <p className={styles.sentenceRoman}>{exampleSentenceRoman}</p>}
            {exampleSentenceEnglish && <p className={styles.sentenceEnglish}>{exampleSentenceEnglish}</p>}
          </button>
        </div>
      )}

      {/* Practice examples */}
      {practiceExamples.length > 0 && (
        <div className={styles.practiceSection}>
          <div className={styles.practiceLabel}>Practice Examples</div>
          {practiceExamples.map((ex, i) => (
            <div key={i} className={styles.exampleCard}>
              <button
                onClick={() => onSpeak?.(ex.hindi)}
                style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%", padding: 0 }}
              >
                <p className={styles.exampleHindi}>{ex.hindi}</p>
                {ex.roman && <p className={styles.exampleRoman}>{ex.roman}</p>}
                {ex.english && <p className={styles.exampleEnglish}>{ex.english}</p>}
              </button>
              {ex.explanation && <p className={styles.exampleExplanation}>{ex.explanation}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Common mistakes */}
      {commonMistakes.length > 0 && (
        <div className={styles.mistakesSection}>
          <div className={styles.mistakesLabel}>Common Mistakes to Avoid</div>
          {commonMistakes.map((m, i) => (
            <div key={i} className={styles.mistakeCard}>
              <div className={styles.mistakeLabel}>✗ Wrong</div>
              <p className={styles.mistakeWrong}>{m.wrong}</p>
              <div className={styles.mistakeLabel}>✓ Correct</div>
              <p className={styles.mistakeCorrect}>{m.correct}</p>
              {m.explanation && <p className={styles.mistakeExplanation}>{m.explanation}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Transformation exercises */}
      {transformationExercises.length > 0 && (
        <div className={styles.transformSection}>
          <div className={styles.transformLabel}>Transformation Exercises</div>
          {transformationExercises.map((tx, i) => (
            <div key={i} className={styles.transformCard}>
              <p className={styles.transformInstruction}>{tx.instruction}</p>
              {tx.inputHindi && tx.outputHindi && (
                <div className={styles.transformExample}>
                  <div className={styles.transformInput}>{tx.inputHindi}</div>
                  <div className={styles.transformArrow}>→</div>
                  <div className={styles.transformOutput}>{tx.outputHindi}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MCQ questions */}
      {mcqQuestions.length > 0 && (
        <div className={styles.mcqSection}>
          <div className={styles.mcqLabel}>Quiz</div>
          {mcqQuestions.map((q, qIdx) => {
            const chosen = mcqAnswers[qIdx];
            const answered = chosen !== undefined;
            return (
              <div key={qIdx} className={styles.mcqCard}>
                <p className={styles.mcqQuestion}>{q.question}</p>
                <div className={styles.optionsList}>
                  {q.options.map((opt, optIdx) => {
                    let cls = styles.option;
                    if (answered) {
                      if (optIdx === q.correctIndex) cls = `${styles.option} ${styles.optionCorrect}`;
                      else if (optIdx === chosen) cls = `${styles.option} ${styles.optionIncorrect}`;
                    }
                    return (
                      <button
                        key={optIdx}
                        className={cls}
                        onClick={() => !answered && handleMcqAnswer(qIdx, optIdx)}
                        disabled={answered}
                        style={{ textAlign: "left" }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {answered && q.explanation && (
                  <p className={styles.mcqExplanation}>{q.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
