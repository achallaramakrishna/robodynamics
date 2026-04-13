"use client";

import { useState } from "react";

interface Transaction {
  id: number;
  date: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  isToday?: boolean;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1,  date: "01 Jan", description: "Opening Balance",      debit: null, credit: 2000, balance: 2000 },
  { id: 2,  date: "05 Jan", description: "Pocket Money Deposit", debit: null, credit: 500,  balance: 2500 },
  { id: 3,  date: "08 Jan", description: "School Fee",           debit: 800,  credit: null, balance: 1700 },
  { id: 4,  date: "12 Jan", description: "Pocket Money Deposit", debit: null, credit: 500,  balance: 2200 },
  { id: 5,  date: "15 Jan", description: "Stationery Purchase",  debit: 150,  credit: null, balance: 2050 },
  { id: 6,  date: "19 Jan", description: "Pocket Money Deposit", debit: null, credit: 500,  balance: 2550 },
  { id: 7,  date: "22 Jan", description: "School Trip Fee",      debit: 300,  credit: null, balance: 2250 },
  { id: 8,  date: "26 Jan", description: "Pocket Money Deposit", debit: null, credit: 500,  balance: 2750 },
  { id: 9,  date: "30 Jan", description: "Canteen",              debit: 120,  credit: null, balance: 2630 },
  { id: 10, date: "TODAY",  description: "Current Balance",      debit: null, credit: null, balance: 2630, isToday: true },
];

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function PassbookViewer() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [showForm, setShowForm] = useState(false);
  const [formDesc, setFormDesc] = useState("");
  const [formType, setFormType] = useState<"debit" | "credit">("credit");
  const [formAmount, setFormAmount] = useState("");
  const [formError, setFormError] = useState("");

  const currentBalance = transactions[transactions.length - 1].balance;

  function handleAddTransaction() {
    const amount = parseFloat(formAmount);
    if (!formDesc.trim()) {
      setFormError("Please enter a description.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }

    const prevBalance = currentBalance;
    const newBalance =
      formType === "debit" ? prevBalance - amount : prevBalance + amount;

    if (formType === "debit" && newBalance < 0) {
      setFormError("Insufficient balance for this debit.");
      return;
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    // Remove the "TODAY / Current Balance" sentinel row, append new txn, re-add sentinel
    const withoutSentinel = transactions.filter((t) => !t.isToday);

    const newTxn: Transaction = {
      id: Date.now(),
      date: dateStr,
      description: formDesc.trim(),
      debit: formType === "debit" ? amount : null,
      credit: formType === "credit" ? amount : null,
      balance: newBalance,
    };

    const updatedSentinel: Transaction = {
      ...transactions[transactions.length - 1],
      balance: newBalance,
    };

    setTransactions([...withoutSentinel, newTxn, updatedSentinel]);
    setFormDesc("");
    setFormAmount("");
    setFormType("credit");
    setFormError("");
    setShowForm(false);
  }

  return (
    <div
      style={{
        background: "#0F172A",
        minHeight: "100vh",
        padding: "24px 16px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1
          style={{
            color: "#F0FDF4",
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: 0.5,
          }}
        >
          Digital Passbook
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>
          Learn how bank transactions work — just like a real passbook!
        </p>
      </div>

      {/* Passbook Container */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "#FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {/* ── LEFT PANEL: Account Info Card ── */}
        <div
          style={{
            background: "#065F46",
            color: "#FFFFFF",
            padding: "28px 24px",
            minWidth: 220,
            flexBasis: "260px",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* Bank Logo Row */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 28,
                marginBottom: 4,
                lineHeight: 1,
              }}
            >
              🏦
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: 0.3,
                lineHeight: 1.3,
              }}
            >
              SBI Junior Savings
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#A7F3D0",
                marginTop: 2,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Student Savings Account
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.2)",
              marginBottom: 20,
            }}
          />

          {/* Account Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InfoRow label="Account Holder" value="Arjun Sharma" />
            <InfoRow label="Account No" value="5521 **** **** 8834" mono />
            <InfoRow label="Branch" value="Koramangala, Bengaluru" />
            <InfoRow label="IFSC Code" value="SBIN0012345" mono />
            <InfoRow label="Opening Balance" value="₹2,000" />
          </div>

          {/* Spacer */}
          <div style={{ flexGrow: 1, minHeight: 24 }} />

          {/* Current Balance Box */}
          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              borderRadius: 10,
              padding: "14px 16px",
              marginTop: 8,
            }}
          >
            <div
              style={{ fontSize: 11, color: "#A7F3D0", marginBottom: 4, letterSpacing: 0.5 }}
            >
              CURRENT BALANCE
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
              {fmt(currentBalance)}
            </div>
          </div>

          {/* Passbook badge */}
          <div
            style={{
              marginTop: 16,
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 10,
              color: "#D1FAE5",
              textAlign: "center",
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            Passbook — Jan 2025
          </div>
        </div>

        {/* ── RIGHT PANEL: Transaction Table ── */}
        <div
          style={{
            flexBasis: "480px",
            flexGrow: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              background: "#065F46",
              padding: "16px 20px 12px",
              borderBottom: "3px solid #047857",
            }}
          >
            <div style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 14 }}>
              Transaction History
            </div>
            <div style={{ color: "#A7F3D0", fontSize: 11, marginTop: 2 }}>
              January 2025 — {transactions.filter((t) => !t.isToday).length} entries
            </div>
          </div>

          {/* Scrollable Table */}
          <div style={{ overflowX: "auto", flexGrow: 1 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
                minWidth: 480,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F0FDF4",
                    borderBottom: "2px solid #D1FAE5",
                  }}
                >
                  {["Date", "Description", "Debit (₹)", "Credit (₹)", "Balance (₹)"].map(
                    (h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 12px",
                          textAlign: i === 0 || i === 1 ? "left" : "right",
                          fontWeight: 600,
                          color: "#065F46",
                          fontSize: 12,
                          whiteSpace: "nowrap",
                          letterSpacing: 0.2,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, idx) => {
                  const isEven = idx % 2 === 0;
                  const isSentinel = txn.isToday;

                  return (
                    <tr
                      key={txn.id}
                      style={{
                        background: isSentinel
                          ? "#ECFDF5"
                          : isEven
                          ? "#FFFFFF"
                          : "#F8FAFC",
                        borderBottom: "1px solid #E2E8F0",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Date */}
                      <td
                        style={{
                          padding: "10px 12px",
                          color: isSentinel ? "#065F46" : "#64748B",
                          fontSize: 12,
                          whiteSpace: "nowrap",
                          fontWeight: isSentinel ? 700 : 400,
                        }}
                      >
                        {txn.date}
                      </td>

                      {/* Description */}
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#1E293B",
                          fontWeight: isSentinel ? 700 : 400,
                        }}
                      >
                        {txn.description}
                      </td>

                      {/* Debit */}
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: txn.debit ? "#EF4444" : "#CBD5E1",
                          fontWeight: txn.debit ? 600 : 400,
                        }}
                      >
                        {txn.debit ? txn.debit.toLocaleString("en-IN") : "—"}
                      </td>

                      {/* Credit */}
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: txn.credit ? "#10B981" : "#CBD5E1",
                          fontWeight: txn.credit ? 600 : 400,
                        }}
                      >
                        {txn.credit ? txn.credit.toLocaleString("en-IN") : "—"}
                      </td>

                      {/* Balance */}
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontWeight: 700,
                          color: "#1E293B",
                        }}
                      >
                        {txn.balance.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Add Transaction Section ── */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "2px solid #E2E8F0",
              background: "#F8FAFC",
            }}
          >
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  background: "#065F46",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  letterSpacing: 0.3,
                }}
              >
                <span style={{ fontSize: 16 }}>+</span> Add Transaction
              </button>
            ) : (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #D1FAE5",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "#065F46",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  New Transaction
                </div>

                {/* Description */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: 0.4 }}>
                    DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={formDesc}
                    onChange={(e) => {
                      setFormDesc(e.target.value);
                      setFormError("");
                    }}
                    placeholder="e.g. Book Fair, Birthday Gift..."
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #CBD5E1",
                      fontSize: 13,
                      outline: "none",
                      color: "#1E293B",
                    }}
                  />
                </div>

                {/* Type + Amount row */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {/* Type Toggle */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: 0.4 }}>
                      TYPE
                    </label>
                    <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "1px solid #CBD5E1" }}>
                      <button
                        onClick={() => setFormType("credit")}
                        style={{
                          padding: "7px 16px",
                          fontSize: 12,
                          fontWeight: 600,
                          border: "none",
                          cursor: "pointer",
                          background: formType === "credit" ? "#10B981" : "#F8FAFC",
                          color: formType === "credit" ? "#FFFFFF" : "#64748B",
                          transition: "background 0.2s, color 0.2s",
                        }}
                      >
                        Credit (Money In)
                      </button>
                      <button
                        onClick={() => setFormType("debit")}
                        style={{
                          padding: "7px 16px",
                          fontSize: 12,
                          fontWeight: 600,
                          border: "none",
                          borderLeft: "1px solid #CBD5E1",
                          cursor: "pointer",
                          background: formType === "debit" ? "#EF4444" : "#F8FAFC",
                          color: formType === "debit" ? "#FFFFFF" : "#64748B",
                          transition: "background 0.2s, color 0.2s",
                        }}
                      >
                        Debit (Money Out)
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, flexGrow: 1, minWidth: 100 }}>
                    <label style={{ fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: 0.4 }}>
                      AMOUNT (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formAmount}
                      onChange={(e) => {
                        setFormAmount(e.target.value);
                        setFormError("");
                      }}
                      placeholder="0"
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #CBD5E1",
                        fontSize: 13,
                        outline: "none",
                        color: "#1E293B",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Error */}
                {formError && (
                  <div style={{ color: "#EF4444", fontSize: 12, fontWeight: 500 }}>
                    {formError}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                  <button
                    onClick={handleAddTransaction}
                    style={{
                      background: "#065F46",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 7,
                      padding: "9px 20px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Add Entry
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormDesc("");
                      setFormAmount("");
                      setFormType("credit");
                      setFormError("");
                    }}
                    style={{
                      background: "transparent",
                      color: "#64748B",
                      border: "1px solid #CBD5E1",
                      borderRadius: 7,
                      padding: "9px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          maxWidth: 1000,
          margin: "16px auto 0",
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <LegendItem color="#EF4444" label="Debit — money going out of your account" />
        <LegendItem color="#10B981" label="Credit — money coming into your account" />
        <LegendItem color="#1E293B" label="Balance — total money left after each transaction" />
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: "#A7F3D0",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#FFFFFF",
          fontFamily: mono ? "'Courier New', monospace" : "inherit",
          letterSpacing: mono ? 0.5 : 0,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ color: "#94A3B8", fontSize: 11 }}>{label}</span>
    </div>
  );
}
