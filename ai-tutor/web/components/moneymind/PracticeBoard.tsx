"use client";

import React, { useState } from "react";

export default function PracticeBoard({ data, practice }: { data: any; practice?: any }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!practice) {
    return (
      <div className="mm-practice-board placeholder">
        <h3>{data?.headline || "Practice Time"}</h3>
        <p>{data?.prompt || "Ready for a challenge?"}</p>
      </div>
    );
  }

  const isCorrect = selected === practice.answer;

  return (
    <div className="mm-practice-board">
      <div className="mm-practice-header">
        <span className="mm-practice-badge">PRACTICE</span>
        <h3>{data?.headline || "Knowledge Check"}</h3>
      </div>

      <p className="mm-practice-prompt">{practice.prompt}</p>

      <div className="mm-options">
        {practice.options?.map((opt: string) => (
          <button
            key={opt}
            disabled={showFeedback}
            onClick={() => setSelected(opt)}
            className={`mm-option-btn ${selected === opt ? "selected" : ""} ${
              showFeedback && opt === practice.answer ? "correct" : ""
            } ${showFeedback && selected === opt && opt !== practice.answer ? "wrong" : ""}`}
          >
            {opt}
            {showFeedback && opt === practice.answer && <span className="icon">✓</span>}
            {showFeedback && selected === opt && opt !== practice.answer && <span className="icon">✗</span>}
          </button>
        ))}
      </div>

      {!showFeedback && selected && (
        <button className="mm-submit-btn" onClick={() => setShowFeedback(true)}>
          Check Answer
        </button>
      )}

      {showFeedback && (
        <div className={`mm-feedback ${isCorrect ? "success" : "error"}`}>
          <div className="mm-feedback-header">
            {isCorrect ? "✨ Brilliant!" : "🤔 Not quite..."}
          </div>
          {!isCorrect && practice.hints && (
            <div className="mm-hints">
              <strong>Hint:</strong> {practice.hints[0]}
            </div>
          )}
          {isCorrect && <p>You've mastered this concept!</p>}
        </div>
      )}

      <style jsx>{`
        .mm-practice-board {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 20px;
          padding: 24px;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .mm-practice-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .mm-practice-badge {
          background: #f59e0b;
          color: #1e293b;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 4px;
        }
        h3 { margin: 0; font-size: 18px; color: #94a3b8; }
        .mm-practice-prompt {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .mm-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .mm-option-btn {
          background: #0f172a;
          border: 2px solid #334155;
          border-radius: 12px;
          padding: 14px 20px;
          color: #cbd5e1;
          text-align: left;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mm-option-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          background: #1e293b;
        }
        .mm-option-btn.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        .mm-option-btn.correct {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .mm-option-btn.wrong {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .mm-submit-btn {
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .mm-feedback {
          margin-top: 20px;
          padding: 16px;
          border-radius: 12px;
          animation: slideDown 0.3s ease-out;
        }
        .mm-feedback.success { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b98122; color: #10b981; }
        .mm-feedback.error { background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b22; color: #f59e0b; }
        .mm-feedback-header { font-weight: 800; margin-bottom: 8px; }
        .mm-hints { font-size: 13px; font-style: italic; opacity: 0.9; }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
