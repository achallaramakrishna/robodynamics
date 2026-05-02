"use client";

import React, { useState, useEffect } from "react";
import "./MoneyMindBoard.css";

type Message = {
  id: string;
  sender: string;
  text: string;
  time: string;
  isScam: boolean;
  explanation: string;
};

const SCENARIOS: Message[] = [
  {
    id: "1",
    sender: "LUCKY_PRIZE",
    text: "CONGRATULATIONS! You won ₹1 Crore in the Grand Mega Lottery! Click here to claim: http://win-big-now.in/claim",
    time: "10:30 AM",
    isScam: true,
    explanation: "Real lotteries never ask you to click suspicious links or pay to win! This is a classic Phishing Scam."
  },
  {
    id: "2",
    sender: "9876543210",
    text: "Hi beta, I am your father's friend. He asked me to send you ₹500 for your books. Just share the OTP you received so I can confirm the transfer.",
    time: "12:15 PM",
    isScam: true,
    explanation: "NEVER share an OTP with anyone. Scammers use emotional stories (like 'I am your father's friend') to steal your account access."
  },
  {
    id: "3",
    sender: "OFFICIAL_BANK",
    text: "Alert: Your account has been blocked for safety. To unblock immediately, visit our branch with your ID.",
    time: "02:00 PM",
    isScam: false,
    explanation: "This is safe! Real banks will ask you to visit the branch for sensitive issues, they never ask for PINs or OTPs over a link."
  },
  {
    id: "4",
    sender: "WINNER_UPI",
    text: "Enter your UPI PIN to COLLECT ₹2,000 cash back from your last shopping! Click here.",
    time: "04:30 PM",
    isScam: true,
    explanation: "THE GOLDEN RULE: You NEVER need your PIN to RECEIVE money. This is a common scam to trick you into sending money instead!"
  }
];

export default function ScamSimulator({ data }: { data?: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [safetyScore, setSafetyScore] = useState(100);
  const [gameState, setGameState] = useState<"ACTIVE" | "FEEDBACK">("ACTIVE");
  const [lastAction, setLastAction] = useState<{ type: string; correct: boolean } | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Use scenario from data if provided, otherwise fallback to hardcoded ones
  const activeScenarios = data?.scenario ? [{
    id: "lesson_scenario",
    sender: data.messageType === 'phone_call' ? (data.callerClaim || "Private Number") : (data.senderName || "Unknown"),
    text: data.scenario || data.messageText || "Suspicious activity detected.",
    time: "Now",
    isScam: true, // In this context, usually testing scam detection
    explanation: data.explanation || "Always verify the source before taking action."
  }] : SCENARIOS;

  const currentScenario = activeScenarios[currentIndex] || activeScenarios[0];

  const handleAction = (action: "TRUST" | "BLOCK" | "REPORT") => {
    let isCorrect = false;
    if (currentScenario.isScam) {
      if (action === "BLOCK" || action === "REPORT") isCorrect = true;
    } else {
      if (action === "TRUST") isCorrect = true;
    }

    if (!isCorrect) {
      setSafetyScore(prev => Math.max(0, prev - 25));
    } else {
      setSafetyScore(prev => Math.min(100, prev + 10));
    }

    setLastAction({ type: action, correct: isCorrect });
    setGameState("FEEDBACK");
  };

  const nextScenario = () => {
    if (currentIndex < activeScenarios.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setGameState("ACTIVE");
      setLastAction(null);
    } else {
      setShowSummary(true);
    }
  };

  if (showSummary) {
    return (
      <div className="scam-sim-container summary">
        <h2>Lab Results: Safety Rank</h2>
        <div className="safety-meter-large">
          <div className="meter-fill" style={{ width: `${safetyScore}%`, background: safetyScore > 70 ? "#10b981" : "#ef4444" }}></div>
          <span>{safetyScore}% Safe</span>
        </div>
        <p className="rank-text">
          {safetyScore === 100 ? "Level: Cyber Guardian (Perfect!)" : 
           safetyScore > 70 ? "Level: Alert Citizen" : 
           "Level: Needs Practice (Careful!)"}
        </p>
        <button onClick={() => { setCurrentIndex(0); setSafetyScore(100); setShowSummary(false); }} className="mm-btn mm-btn-primary">Restart Lab</button>
      </div>
    );
  }

  return (
    <div className="scam-sim-container">
      <div className="scam-sim-header">
        <div className="safety-stat">
          <span className="stat-label">Safety Shield:</span>
          <div className="safety-meter-small">
            <div className="meter-fill" style={{ width: `${safetyScore}%` }}></div>
          </div>
        </div>
        <div className="level-badge">SAFETY LAB</div>
      </div>

      <div className="phone-screen">
        <div className="phone-top-bar">
          <span className="sender-name">{currentScenario.sender}</span>
          <span className="msg-time">{currentScenario.time}</span>
        </div>

        <div className="chat-area">
          <div className="message-bubble received">
            {currentScenario.text}
            {data?.url && (
              <div style={{ marginTop: '10px', color: '#3b82f6', textDecoration: 'underline', fontSize: '12px' }}>
                {data.url}
              </div>
            )}
          </div>

          {gameState === "FEEDBACK" && (
            <div className={`feedback-bubble ${lastAction?.correct ? "success" : "danger"}`}>
              <div className="feedback-icon">{lastAction?.correct ? "✅ Correct!" : "❌ Risky Move!"}</div>
              <p className="explanation-text">{currentScenario.explanation}</p>
              <button onClick={nextScenario} className="next-scenario-btn">Next →</button>
            </div>
          )}
        </div>

        {gameState === "ACTIVE" && (
          <div className="phone-actions">
            <button onClick={() => handleAction("TRUST")} className="action-btn trust">TRUST</button>
            <button onClick={() => handleAction("BLOCK")} className="action-btn block">BLOCK</button>
            <button onClick={() => handleAction("REPORT")} className="action-btn report">REPORT</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .scam-sim-container {
          width: 100%;
          max-width: 400px;
          background: #f1f5f9;
          border-radius: 24px;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .scam-sim-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .stat-label { font-size: 12px; font-weight: 700; color: #64748b; margin-right: 8px; }
        .safety-meter-small {
          width: 120px;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;
        }
        .meter-fill { height: 100%; background: #10b981; transition: width 0.5s ease; }
        .level-badge { background: #3b82f6; color: white; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 999px; }
        
        .phone-screen {
          background: #fff;
          height: 500px;
          border-radius: 32px;
          border: 10px solid #1e293b;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .phone-top-bar {
          background: #f8fafc;
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sender-name { font-weight: 800; color: #1e293b; font-size: 14px; }
        .msg-time { font-size: 10px; color: #94a3b8; }

        .chat-area {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .message-bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
        }
        .received { background: #f1f5f9; align-self: flex-start; border-bottom-left-radius: 4px; color: #334155; }
        
        .feedback-bubble {
          background: #fff;
          padding: 15px;
          border-radius: 16px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          animation: slideUp 0.3s ease-out;
        }
        .feedback-bubble.success { border: 2px solid #10b981; }
        .feedback-bubble.danger { border: 2px solid #ef4444; }
        .feedback-icon { font-weight: 800; margin-bottom: 8px; font-size: 16px; }
        .explanation-text { font-size: 12px; color: #475569; margin-bottom: 12px; }
        .next-scenario-btn { background: #1e293b; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; cursor: pointer; }

        .phone-actions {
          padding: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        .action-btn {
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .action-btn:active { transform: scale(0.95); }
        .trust { background: #ecfdf5; color: #065f46; }
        .block { background: #fef2f2; color: #b91c1c; }
        .report { background: #eff6ff; color: #1e40af; }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .summary { text-align: center; }
        .safety-meter-large { width: 100%; height: 24px; background: #e2e8f0; border-radius: 12px; overflow: hidden; position: relative; margin: 20px 0; }
        .safety-meter-large span { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: #fff; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .rank-text { font-weight: 800; font-size: 20px; color: #1e293b; margin-bottom: 30px; }
      `}</style>
    </div>
  );
}
