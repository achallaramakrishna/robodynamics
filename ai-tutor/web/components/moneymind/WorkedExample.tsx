"use client";

import React from "react";

export default function WorkedExample({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="mm-worked-example">
      {data.expression && (
        <div className="mm-example-expression">
          <code>{data.expression}</code>
        </div>
      )}
      
      <div className="mm-example-steps">
        {data.steps?.map((step: string, i: number) => (
          <div key={i} className="mm-example-step">
            <span className="mm-step-number">{i + 1}</span>
            <span className="mm-step-text">{step}</span>
          </div>
        ))}
      </div>

      {data.answer !== undefined && (
        <div className="mm-example-answer">
          <span className="mm-answer-label">Final Result:</span>
          <span className="mm-answer-value">₹{data.answer.toLocaleString()}</span>
        </div>
      )}

      <style jsx>{`
        .mm-worked-example {
          background: #0f172a;
          border: 2px solid #334155;
          border-radius: 16px;
          padding: 24px;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          width: 100%;
          max-width: 500px;
        }
        .mm-example-expression {
          background: #1e293b;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 18px;
          font-weight: 700;
          color: #3b82f6;
          border-left: 4px solid #3b82f6;
        }
        .mm-example-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .mm-example-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          padding: 10px;
          border-radius: 8px;
        }
        .mm-step-number {
          background: #3b82f6;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          flex-shrink: 0;
        }
        .mm-step-text {
          font-size: 14px;
          line-height: 1.5;
        }
        .mm-example-answer {
          border-top: 1px solid #334155;
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mm-answer-label {
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }
        .mm-answer-value {
          font-size: 24px;
          font-weight: 900;
          color: #10b981;
        }
      `}</style>
    </div>
  );
}
