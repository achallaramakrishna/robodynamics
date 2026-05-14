"use client";

import { useState } from "react";
import styles from "./KaveriGrammarExplainer.module.css";

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
  inputKannada?: string;
  outputKannada?: string;
}

interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface KaveriGrammarExplainerProps {
  grammarTopic: string;
  grammarTopicKannada?: string;
  ruleExplanation?: string;
  ruleExplanationKannada?: string;
  exampleSentenceKannada?: string;
  exampleSentenceRoman?: string;
  exampleSentenceEnglish?: string;
  practiceExamples?: PracticeExample[];
  commonMistakes?: CommonMistake[];
  transformationExercises?: TransformationExercise[];
  mcqQuestions?: MCQQuestion[];
  onSpeak?: (text: string) => void;
}

export default function KaveriGrammarExplainer({
  grammarTopic,
  grammarTopicKannada,
  ruleExplanation,
  ruleExplanationKannada,
  exampleSentenceKannada,
  exampleSentenceRoman,
  exampleSentenceEnglish,
  practiceExamples = [],
  commonMistakes = [],
  transformationExercises = [],
  mcqQuestions = [],
  onSpeak,
}: KaveriGrammarExplainerProps) {
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});

  function handleMcqAnswer(qIdx: number, optIdx: number) {
    setMcqAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  return (
    <div className={styles.container}>
      {/* Rule explanation */}
      <div className={styles.ruleBox}>
        <h3 className={styles.ruleTitle}>{grammarTopic}</h3>
        {grammarTopicKannada && <p className={styles.ruleTitleHindi}>{grammarTopicKannada}</p>}
        {ruleExplanation && <p className={styles.ruleText}>{ruleExplanation}</p>}
        {ruleExplanationKannada && <p className={styles.ruleText}>{ruleExplanationKannada}</p>}
      </div>

      {/* Example sentence */}
      {exampleSentenceKannada && (
        <div className={styles.exampleSection}>
          <span className={styles.exampleLabel}>Example</span>
          <button
            onClick={() => onSpeak?.(exampleSentenceKannada)}
            style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%", padding: 0 }}
          >
            <p className={styles.sentenceHindi}>{exampleSentenceKannada}</p>
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
              {tx.inputKannada && tx.outputKannada && (
                <div className={styles.transformExample}>
                  <div className={styles.transformInput}>{tx.inputKannada}</div>
                  <div className={styles.transformArrow}>→</div>
                  <div className={styles.transformOutput}>{tx.outputKannada}</div>
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
