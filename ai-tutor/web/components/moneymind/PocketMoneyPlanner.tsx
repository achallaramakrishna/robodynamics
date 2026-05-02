"use client";

import React, { useState } from "react";

const WEEKLY_ALLOWANCE = 500;

interface Category {
  id: string;
  label: string;
  emoji: string;
  defaultAmount: number;
}

const CATEGORIES: Category[] = [
  { id: "canteen",   label: "School Canteen", emoji: "🍱", defaultAmount: 80  },
  { id: "stationery",label: "Stationery",     emoji: "📚", defaultAmount: 50  },
  { id: "games",     label: "Games / Apps",   emoji: "🎮", defaultAmount: 100 },
  { id: "transport", label: "Transport",      emoji: "🚌", defaultAmount: 60  },
  { id: "snacks",    label: "Snacks / Treats",emoji: "🍦", defaultAmount: 70  },
  { id: "others",    label: "Others",         emoji: "🎁", defaultAmount: 0   },
];

function buildDefaultAmounts(): Record<string, number> {
  const map: Record<string, number> = {};
  CATEGORIES.forEach((c) => { map[c.id] = c.defaultAmount; });
  return map;
}

export default function PocketMoneyPlanner() {
  const [amounts, setAmounts] = useState<Record<string, number>>(buildDefaultAmounts);

  const totalSpent = Object.values(amounts).reduce((sum, v) => sum + (isNaN(v) ? 0 : v), 0);
  const saved      = WEEKLY_ALLOWANCE - totalSpent;
  const savingsPct = Math.max(0, Math.round((saved / WEEKLY_ALLOWANCE) * 100));
  const isOverBudget = saved < 0;

  function handleChange(id: string, raw: string) {
    const val = raw === "" ? 0 : Math.max(0, parseInt(raw, 10) || 0);
    setAmounts((prev) => ({ ...prev, [id]: val }));
  }

  function getMessage(): { text: string; color: string } {
    if (isOverBudget) {
      return {
        text: `Oops! You've gone over budget. ₹${Math.abs(saved)} over. 🚨`,
        color: "#EF4444",
      };
    }
    if (savingsPct > 20) {
      return {
        text: "Great saver! 🌟 You're building good habits.",
        color: "#10B981",
      };
    }
    if (savingsPct >= 10) {
      return {
        text: "Good start! Try to save a little more. 💪",
        color: "#F59E0B",
      };
    }
    return {
      text: "Careful! Try cutting back on one category. 🤔",
      color: "#F87171",
    };
  }

  const message = getMessage();
  const meterWidth = Math.min(100, Math.max(0, savingsPct));

  // ── styles ────────────────────────────────────────────────────────────────

  const cardStyle: React.CSSProperties = {
    background: "#1E293B",
    border: "1px solid #334155",
    borderRadius: "16px",
    padding: "24px",
    width: "100%",
    maxWidth: "560px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#E2E8F0",
    boxSizing: "border-box",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 700,
    color: "#E2E8F0",
    margin: 0,
  };

  const allowanceBadgeStyle: React.CSSProperties = {
    background: "#0F172A",
    border: "1px solid #334155",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#94A3B8",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#64748B",
    padding: "0 0 10px 0",
  };

  const thRightStyle: React.CSSProperties = {
    ...thStyle,
    textAlign: "right" as const,
    width: "110px",
  };

  const tdLabelStyle: React.CSSProperties = {
    padding: "8px 0",
    fontSize: "15px",
    color: "#CBD5E1",
    verticalAlign: "middle",
  };

  const tdInputStyle: React.CSSProperties = {
    padding: "8px 0",
    textAlign: "right" as const,
    verticalAlign: "middle",
  };

  const inputStyle: React.CSSProperties = {
    background: "#0F172A",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#E2E8F0",
    fontSize: "15px",
    fontWeight: 600,
    padding: "6px 10px",
    width: "90px",
    textAlign: "right" as const,
    outline: "none",
    boxSizing: "border-box",
  };

  const dividerStyle: React.CSSProperties = {
    border: "none",
    borderTop: "1px solid #334155",
    margin: "4px 0 20px 0",
  };

  const summaryRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap" as const,
  };

  const summaryBoxStyle = (bg: string): React.CSSProperties => ({
    flex: 1,
    minWidth: "120px",
    background: "#0F172A",
    border: `1px solid ${bg}33`,
    borderRadius: "10px",
    padding: "12px 16px",
  });

  const summaryLabelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#64748B",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
    marginBottom: "4px",
  };

  const summaryValueStyle = (color: string): React.CSSProperties => ({
    fontSize: "22px",
    fontWeight: 800,
    color,
  });

  const pctBadgeStyle: React.CSSProperties = {
    display: "inline-block",
    marginTop: "4px",
    background: "#10B98122",
    color: "#10B981",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: 700,
  };

  const meterTrackStyle: React.CSSProperties = {
    background: "#0F172A",
    border: "1px solid #334155",
    borderRadius: "99px",
    height: "14px",
    overflow: "hidden",
    marginBottom: "14px",
  };

  const meterFillStyle: React.CSSProperties = {
    height: "100%",
    width: `${meterWidth}%`,
    background: isOverBudget
      ? "#EF4444"
      : meterWidth > 20
      ? "#10B981"
      : "#F59E0B",
    borderRadius: "99px",
    transition: "width 0.35s ease, background 0.35s ease",
  };

  const meterLabelsStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#475569",
    marginTop: "-10px",
    marginBottom: "16px",
  };

  const messageBoxStyle: React.CSSProperties = {
    background: `${message.color}18`,
    border: `1px solid ${message.color}44`,
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 600,
    color: message.color,
    textAlign: "center" as const,
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>This Week's Budget</h2>
        <div style={allowanceBadgeStyle}>Allowance: ₹{WEEKLY_ALLOWANCE}</div>
      </div>

      {/* Category table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Category</th>
            <th style={thRightStyle}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {CATEGORIES.map((cat, idx) => (
            <tr
              key={cat.id}
              style={{
                background: idx % 2 === 0 ? "transparent" : "#ffffff06",
              }}
            >
              <td style={tdLabelStyle}>
                <span style={{ marginRight: "8px" }}>{cat.emoji}</span>
                {cat.label}
              </td>
              <td style={tdInputStyle}>
                <span style={{ color: "#64748B", marginRight: "4px", fontSize: "13px" }}>₹</span>
                <input
                  type="number"
                  min={0}
                  value={amounts[cat.id] === 0 ? "" : amounts[cat.id]}
                  placeholder="0"
                  onChange={(e) => handleChange(cat.id, e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = "#10B981";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = "#334155";
                    if ((e.target as HTMLInputElement).value === "") {
                      handleChange(cat.id, "0");
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={dividerStyle} />

      {/* Summary boxes */}
      <div style={summaryRowStyle}>
        <div style={summaryBoxStyle("#F59E0B")}>
          <div style={summaryLabelStyle}>Total Spent</div>
          <div style={summaryValueStyle(isOverBudget ? "#EF4444" : "#F59E0B")}>
            ₹{totalSpent}
          </div>
        </div>

        <div style={summaryBoxStyle("#10B981")}>
          <div style={summaryLabelStyle}>Saved</div>
          <div style={summaryValueStyle(isOverBudget ? "#EF4444" : "#10B981")}>
            ₹{isOverBudget ? 0 : saved}
          </div>
          {!isOverBudget && (
            <div style={pctBadgeStyle}>{savingsPct}% saved</div>
          )}
        </div>
      </div>

      {/* Savings meter */}
      <div style={meterTrackStyle}>
        <div style={meterFillStyle} />
      </div>
      <div style={meterLabelsStyle}>
        <span>0%</span>
        <span>Savings meter</span>
        <span>100%</span>
      </div>

      {/* Encouragement message */}
      <div style={messageBoxStyle}>{message.text}</div>
    </div>
  );
}
