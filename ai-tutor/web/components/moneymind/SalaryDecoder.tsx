"use client";

import React, { useState } from "react";
import "./MoneyMindBoard.css";

type SalaryItem = {
  id: string;
  label: string;
  amount: number;
  type: "EARNING" | "DEDUCTION";
  description: string;
  secret: string;
};

const SALARY_DATA: SalaryItem[] = [
  { 
    id: "basic", 
    label: "Basic Pay", 
    amount: 45000, 
    type: "EARNING", 
    description: "The core part of your salary. Most other benefits are calculated as a % of this.",
    secret: "A higher Basic is good for your pension (PF), but it increases your taxable income!"
  },
  { 
    id: "hra", 
    label: "House Rent Allowance (HRA)", 
    amount: 18000, 
    type: "EARNING", 
    description: "Money for your house rent.",
    secret: "If you provide rent receipts, this part of your salary is TAX-FREE!"
  },
  { 
    id: "special", 
    label: "Special Allowance", 
    amount: 12000, 
    type: "EARNING", 
    description: "A flexible part of your pay used to reach your total offer.",
    secret: "This is usually fully taxable and doesn't contribute much to your PF."
  },
  { 
    id: "epf", 
    label: "Employee Prov. Fund (EPF)", 
    amount: 5400, 
    type: "DEDUCTION", 
    description: "Your forced savings for retirement. The company also adds an equal amount!",
    secret: "This is a Triple-Exempt (E-E-E) investment. You save tax now, and the interest is also tax-free!"
  },
  { 
    id: "ptax", 
    label: "Professional Tax", 
    amount: 200, 
    type: "DEDUCTION", 
    description: "A small tax paid to the state government where you work.",
    secret: "Usually capped at ₹2,500 per year. It's the cost of being a working professional in India."
  },
  { 
    id: "tds", 
    label: "Income Tax (TDS)", 
    amount: 6400, 
    type: "DEDUCTION", 
    description: "Tax Sent directly to the Government of India.",
    secret: "TDS stands for 'Tax Deducted at Source'. You can get some of this back by investing in 80C schemes!"
  }
];

export default function SalaryDecoder({ data }: { data?: any }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Map incoming data if present
  const lessonEarnings = data?.earnings?.map((e: any, idx: number) => ({
    id: `earn_${idx}`,
    label: e.label,
    amount: e.amount,
    type: "EARNING",
    description: "Part of your monthly gross earnings.",
    secret: "The more you earn, the more tax you might pay, but the more you can save!"
  })) || [];

  const lessonDeductions = data?.deductions?.map((d: any, idx: number) => ({
    id: `ded_${idx}`,
    label: d.label,
    amount: d.amount,
    type: "DEDUCTION",
    description: "Statutory or voluntary deduction from your pay.",
    secret: "Some deductions like PF are actually your own savings for the future!"
  })) || [];

  const activeData = (lessonEarnings.length > 0 || lessonDeductions.length > 0) 
    ? [...lessonEarnings, ...lessonDeductions] 
    : SALARY_DATA;

  const earnings = activeData.filter(i => i.type === "EARNING");
  const deductions = activeData.filter(i => i.type === "DEDUCTION");

  const totalEarnings = earnings.reduce((sum, i) => sum + i.amount, 0);
  const totalDeductions = deductions.reduce((sum, i) => sum + i.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  const selectedItem = activeData.find(i => i.id === selectedId);

  return (
    <div className="salary-decoder-container">
      <div className="decoder-header">
        <div className="badge">SALARY LAB</div>
        <h3>{data?.employee ? `${data.employee}'s Payslip` : "Interactive Salary Decoder"}</h3>
      </div>

      <div className="payslip">
        <div className="payslip-top">
          <div className="company-logo">ROBO DYNAMICS PVT LTD</div>
          <p className="payslip-sub">Monthly Payslip: {data?.month || "April 2026"}</p>
        </div>

        <div className="payslip-grids">
          {/* Earnings Column */}
          <div className="payslip-col">
            <div className="payslip-header">Earnings</div>
            {earnings.map(item => (
              <div 
                key={item.id} 
                className={`payslip-row clickable ${selectedId === item.id ? "active" : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.label}</span>
                <strong>₹{item.amount.toLocaleString()}</strong>
              </div>
            ))}
          </div>

          {/* Deductions Column */}
          <div className="payslip-col">
            <div className="payslip-header">Deductions</div>
            {deductions.map(item => (
              <div 
                key={item.id} 
                className={`payslip-row clickable deduction ${selectedId === item.id ? "active" : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.label}</span>
                <strong className="text-red">-₹{item.amount.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="payslip-footer">
          <div className="footer-stat">
            <span>Gross Pay:</span>
            <strong>₹{(data?.grossEarnings || totalEarnings).toLocaleString()}</strong>
          </div>
          <div className="footer-stat highlight">
            <span>Take-Home (Net):</span>
            <strong>₹{(data?.netPay || netPay).toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="decoder-insight">
        {!selectedId ? (
          <div className="prompt-box">
            <span className="icon">💡</span>
            Click on any part of the salary slip to decode its secrets!
          </div>
        ) : (
          <div className="detail-box">
            <h4>{selectedItem?.label}</h4>
            <p className="description">{selectedItem?.description}</p>
            <div className="secret-section">
              <strong>The Pro Secret:</strong>
              <p>{selectedItem?.secret}</p>
            </div>
            <button className="close-btn" onClick={() => setSelectedId(null)}>Close Decode</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .salary-decoder-container {
          width: 100%;
          min-height: 480px;
          background: #f1f5f9;
          border-radius: 24px;
          padding: 24px;
          font-family: 'Inter', sans-serif;
        }
        .decoder-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .badge { background: #3b82f6; color: white; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 8px; }
        .decoder-header h3 { font-size: 16px; color: #1e293b; margin: 0; }

        .payslip {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .payslip-top { padding: 20px; text-align: center; border-bottom: 2px dashed #e2e8f0; }
        .company-logo { font-size: 14px; font-weight: 900; color: #1e293b; letter-spacing: 0.1em; }
        .payslip-sub { font-size: 12px; color: #64748b; margin: 4px 0 0 0; }

        .payslip-grids { display: grid; grid-template-columns: 1fr 1fr; }
        .payslip-col { border-right: 1px solid #f1f5f9; }
        .payslip-col:last-child { border-right: none; }
        .payslip-header { background: #f8fafc; padding: 10px 15px; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        
        .payslip-row {
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
        }
        .payslip-row.clickable { cursor: pointer; }
        .payslip-row.clickable:hover { background: #eff6ff; }
        .payslip-row.active { background: #dbeafe; border-left: 3px solid #3b82f6; }
        .payslip-row strong { color: #1e293b; }
        .text-red { color: #ef4444 !important; }

        .payslip-footer { background: #1e293b; color: white; padding: 15px 20px; display: flex; justify-content: space-between; }
        .footer-stat { display: flex; flex-direction: column; font-size: 11px; }
        .footer-stat strong { font-size: 14px; margin-top: 2px; }
        .footer-stat.highlight { text-align: right; }
        .footer-stat.highlight strong { color: #4ade80; font-size: 18px; }

        .decoder-insight { margin-top: 20px; min-height: 120px; }
        .prompt-box { 
          text-align: center; 
          padding: 24px; 
          background: rgba(59, 130, 246, 0.05); 
          border: 2px dashed #3b82f6; 
          border-radius: 16px; 
          color: #3b82f6;
          font-weight: 600;
          font-size: 14px;
        }
        .detail-box { 
          background: #fff; 
          padding: 20px; 
          border-radius: 16px; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          animation: slideIn 0.3s ease-out;
        }
        .detail-box h4 { margin: 0 0 10px 0; color: #1e293b; border-bottom: 2px solid #3b82f6; display: inline-block; padding-bottom: 4px; }
        .description { font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 15px; }
        .secret-section { background: #fefce8; padding: 12px; border-radius: 8px; border: 1px solid #fef3c7; }
        .secret-section strong { color: #854d0e; font-size: 12px; display: block; margin-bottom: 4px; }
        .secret-section p { font-size: 12px; color: #713f12; margin: 0; }
        .close-btn { margin-top: 15px; background: #e2e8f0; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; color: #475569; }

        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
