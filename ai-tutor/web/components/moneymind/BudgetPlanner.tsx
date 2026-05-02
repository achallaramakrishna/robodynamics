"use client";

import React, { useState } from "react";

export default function BudgetPlanner({ data }: { data: any }) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  
  if (!data) return null;

  const totalBudget = data.totalBudget || 0;
  
  const calculateTotal = () => {
    let total = 0;
    if (data.categories) {
      data.categories.forEach((cat: any) => {
        cat.items.forEach((item: any) => {
          if (selections[item.name]) {
            const isGeneric = selections[item.name] === "generic";
            total += isGeneric ? item.generic.price : item.price;
          }
        ))}
      );
    } else if (data.items) {
      data.items.forEach((item: any) => {
        if (selections[item.name]) total += item.price;
      });
    }
    return total;
  };

  const totalSpent = calculateTotal();
  const isOver = totalSpent > totalBudget;

  const toggleItem = (itemName: string, variant: string = "standard") => {
    setSelections(prev => {
      const next = { ...prev };
      if (next[itemName] === variant) {
        delete next[itemName];
      } else {
        next[itemName] = variant;
      }
      return next;
    });
  };

  return (
    <div className="mm-budget-planner">
      <div className="mm-planner-header">
        <div className="mm-budget-info">
          <span className="label">TOTAL BUDGET</span>
          <span className="value">₹{totalBudget.toLocaleString()}</span>
        </div>
        <div className={`mm-spent-info ${isOver ? "over" : ""}`}>
          <span className="label">TOTAL SPENT</span>
          <span className="value">₹{totalSpent.toLocaleString()}</span>
        </div>
      </div>

      <div className="mm-categories">
        {data.categories?.map((cat: any) => (
          <div key={cat.name} className="mm-category">
            <h4>{cat.name}</h4>
            <div className="mm-items-grid">
              {cat.items.map((item: any) => (
                <div key={item.name} className={`mm-item-card ${selections[item.name] ? "selected" : ""}`}>
                  <div className="mm-item-info">
                    <span className="name">{item.name}</span>
                    <span className="price">₹{item.price}</span>
                  </div>
                  <div className="mm-item-actions">
                    <button 
                      onClick={() => toggleItem(item.name, "standard")}
                      className={`mm-select-btn ${selections[item.name] === "standard" ? "active" : ""}`}
                    >
                      {selections[item.name] === "standard" ? "Added" : "Add"}
                    </button>
                    {item.generic && (
                      <button 
                        onClick={() => toggleItem(item.name, "generic")}
                        className={`mm-select-btn generic ${selections[item.name] === "generic" ? "active" : ""}`}
                      >
                        {selections[item.name] === "generic" ? "Using Store Brand" : "Switch to Generic (₹" + item.generic.price + ")"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!data.categories && data.items && (
          <div className="mm-items-list">
             {data.items.map((item: any) => (
                <div key={item.name} className={`mm-list-item ${selections[item.name] ? "selected" : ""}`} onClick={() => toggleItem(item.name)}>
                  <div className="name-box">
                    <span className="checkbox">{selections[item.name] ? "✓" : ""}</span>
                    <span className="name">{item.name}</span>
                  </div>
                  <span className="price">₹{item.price}</span>
                </div>
             ))}
          </div>
        )}
      </div>

      {isOver && (
        <div className="mm-warning">
          ⚠️ You are ₹{(totalSpent - totalBudget).toLocaleString()} over budget! Try switching to generic brands or removing items.
        </div>
      )}

      <style jsx>{`
        .mm-budget-planner {
          background: #1e293b;
          border-radius: 20px;
          padding: 24px;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          width: 100%;
          max-width: 600px;
        }
        .mm-planner-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
          background: #0f172a;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #334155;
        }
        .mm-budget-info, .mm-spent-info {
          display: flex;
          flex-direction: column;
        }
        .label { font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 4px; }
        .value { font-size: 24px; font-weight: 900; }
        .mm-spent-info.over .value { color: #ef4444; }
        .mm-spent-info:not(.over) .value { color: #10b981; }

        .mm-category h4 { margin: 20px 0 12px; color: #f59e0b; font-size: 16px; }
        .mm-items-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .mm-item-card {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }
        .mm-item-card.selected { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
        .mm-item-info { display: flex; flex-direction: column; }
        .name { font-weight: 600; }
        .price { color: #94a3b8; font-size: 14px; }
        
        .mm-item-actions { display: flex; gap: 8px; }
        .mm-select-btn {
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .mm-select-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
        .mm-select-btn.generic { color: #10b981; border-color: #10b98133; }
        .mm-select-btn.generic.active { background: #10b981; color: white; }

        .mm-items-list { display: flex; flex-direction: column; gap: 8px; }
        .mm-list-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: #0f172a;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .mm-list-item.selected { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
        .name-box { display: flex; gap: 12px; align-items: center; }
        .checkbox { width: 20px; height: 20px; border: 2px solid #334155; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #10b981; }
        
        .mm-warning { margin-top: 24px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef444444; color: #ef4444; padding: 12px; border-radius: 8px; font-size: 14px; text-align: center; font-weight: 600; }
      `}</style>
    </div>
  );
}
