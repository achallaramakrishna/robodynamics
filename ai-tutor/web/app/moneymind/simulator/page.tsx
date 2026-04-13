"use client";

import React, { useState } from "react";
import AtmSimulator from "../../../components/moneymind/AtmSimulator";
import BankPortal from "../../../components/moneymind/BankPortal";
import UpiSimulator from "../../../components/moneymind/UpiSimulator";
import SavingsGoalTracker from "../../../components/moneymind/SavingsGoalTracker";
import ParentDashboard from "../../../components/moneymind/ParentDashboard";

type Tab = "BANK" | "ATM" | "UPI" | "GOALS" | "PARENT";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "BANK",   label: "Bank Portal",   emoji: "🏦" },
  { id: "ATM",    label: "ATM",           emoji: "🏧" },
  { id: "UPI",    label: "UPI Lab",       emoji: "📱" },
  { id: "GOALS",  label: "Goals",         emoji: "🎯" },
  { id: "PARENT", label: "Parent Mode",   emoji: "👨‍👩‍👧" },
];

export default function MoneyMindSimulator() {
  const [activeTab, setActiveTab] = useState<Tab>("BANK");
  const userId = 101;

  return (
    <div style={{ background: "#0F172A", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mm-tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
        .mm-content { animation: fadeIn 0.3s ease; }

        /* Responsive tweaks */
        @media (max-width: 600px) {
          .mm-title { font-size: 22px !important; }
          .mm-subtitle { font-size: 13px !important; }
          .mm-tab-label { display: none; }
          .mm-tab-emoji { font-size: 22px !important; }
          .mm-tab-btn { padding: 10px 12px !important; }
          .mm-wrapper { padding: 20px 12px !important; }
        }
        @media (max-width: 400px) {
          .mm-tab-btn { padding: 8px 8px !important; min-width: 44px; }
        }
      `}</style>

      <div className="mm-wrapper" style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <a href="/moneymind" style={{ color: "#F59E0B", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            ← Back to MoneyMind
          </a>
          <h1 className="mm-title" style={{ color: "#fff", fontSize: 30, fontWeight: 900, margin: "12px 0 6px" }}>
            MoneyMind <span style={{ color: "#F59E0B" }}>Virtual World</span>
          </h1>
          <p className="mm-subtitle" style={{ color: "#94A3B8", fontSize: 15, margin: 0 }}>
            Practice real financial transactions in a safe, simulated environment.
          </p>
        </div>

        {/* Tab Row */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div
            className="mm-tabs"
            style={{ background: "#1E293B", padding: 6, borderRadius: 14, border: "1px solid #334155" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="mm-tab-btn"
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: activeTab === tab.id ? "#3B82F6" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "#94A3B8",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s ease",
                }}
              >
                <span className="mm-tab-emoji" style={{ fontSize: 16 }}>{tab.emoji}</span>
                <span className="mm-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mm-content" style={{ display: "flex", justifyContent: "center" }}>
          {activeTab === "ATM"    && <AtmSimulator userId={userId} />}
          {activeTab === "BANK"   && <div style={{ width: "100%" }}><BankPortal userId={userId} /></div>}
          {activeTab === "UPI"    && <UpiSimulator userId={userId} />}
          {activeTab === "GOALS"  && <div style={{ width: "100%", maxWidth: 600 }}><SavingsGoalTracker userId={userId} /></div>}
          {activeTab === "PARENT" && <div style={{ width: "100%" }}><ParentDashboard userId={userId} /></div>}
        </div>

      </div>
    </div>
  );
}
