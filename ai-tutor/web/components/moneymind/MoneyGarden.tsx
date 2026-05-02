"use client";

import React, { useState, useMemo } from "react";
import "./MoneyMindBoard.css";

const ANNUAL_RATE = 0.12; // 12% growth (Aggressive/Equity style)
const INITIAL_SEED = 1000;

export default function MoneyGarden({ data }: { data?: any }) {
  const [years, setYears] = useState(0);
  
  const initialSeed = data?.principal || INITIAL_SEED;
  const rates = data?.rates || [
    { label: "Wealth Tree (12%)", rate: 12, color: "#10b981", type: "compound" },
    { label: "Simple Growth", rate: 12, color: "#3b82f6", type: "simple" },
    { label: "Piggy Bank (Cash)", rate: 0, color: "#94a3b8", type: "cash" }
  ];

  const stats = useMemo(() => {
    return rates.map((r: any) => {
      const rateDecimal = (r.rate || 0) / 100;
      let value = initialSeed;
      if (r.type === "simple") {
        value = initialSeed * (1 + rateDecimal * years);
      } else if (r.rate === 0 || r.type === "cash") {
        value = initialSeed;
      } else {
        value = initialSeed * Math.pow(1 + rateDecimal, years);
      }
      return { ...r, currentValue: Math.round(value) };
    });
  }, [years, initialSeed, rates]);

  // Max value for scale (approx 30x the initial seed for 30y at 12%)
  const maxScale = initialSeed * 30;

  // Determine tree stage index (0 to 4)
  const treeStage = years === 0 ? 0 : 
                    years < 5 ? 1 :
                    years < 12 ? 2 :
                    years < 22 ? 3 : 4;

  return (
    <div className="money-garden-container">
      <div className="garden-header">
        <h3>{data?.headline || "L5 LAB: The Compounding Garden"}</h3>
        <div className="seed-badge">Initial Seed: ₹{initialSeed.toLocaleString()}</div>
      </div>

      <div className="garden-view">
        <div className="grid-overlay"></div>
        
        {/* The Growth Visuals */}
        <div className="visual-stage">
          <div className={`growth-organism stage-${treeStage}`}>
            {treeStage === 0 && <span className="entity">🌱</span>}
            {treeStage === 1 && <span className="entity">🌿</span>}
            {treeStage === 2 && <span className="entity">🌲</span>}
            {treeStage === 3 && <span className="entity">🌳</span>}
            {treeStage === 4 && <span className="entity">🌴✨</span>}
            <div className="ground-shadow"></div>
          </div>
          <div className="year-float">Year {years}</div>
        </div>

        {/* Comparison Bars */}
        <div className="garden-stats">
          {stats.map((stat: any, i: number) => (
            <div key={i} className="stat-row">
              <div className="stat-info">
                <span className="label">{stat.label}</span>
                <span className="value" style={{ color: stat.color, fontWeight: 900 }}>₹{stat.currentValue.toLocaleString()}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: `${Math.min(100, (stat.currentValue / maxScale) * 100)}%`,
                    background: stat.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="slider-section">
        <div className="slider-label">
          <span>Time machine:</span>
          <strong>{years} Years</strong>
        </div>
        <input 
          type="range" 
          min="0" 
          max={data?.years || 30} 
          value={years} 
          onChange={(e) => setYears(parseInt(e.target.value))}
          className="garden-slider"
        />
        <div className="slider-ticks">
          <span>Today</span>
          <span>{Math.round((data?.years || 30) / 3)}y</span>
          <span>{Math.round((data?.years || 30) * 2 / 3)}y</span>
          <span>{data?.years || 30}y</span>
        </div>
      </div>

      <div className="garden-insight">
        {years === 0 && `Plant your ₹${initialSeed.toLocaleString()} seed and move the slider to see the future.`}
        {years > 0 && years < 7 && `In ${years} years, your money is growing slowly but surely.`}
        {years >= 7 && years < 15 && `Year 7 Milestone: Compound interest starts taking off!`}
        {years >= 15 && years < 25 && "Notice the massive gap starting to form between simple and compound growth."}
        {years >= 25 && "Absolute Power: Compounding has turned your small seed into a massive forest!"}
      </div>

      <style jsx>{`
        .money-garden-container {
          width: 100%;
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          font-family: 'Outfit', sans-serif;
        }
        .garden-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .garden-header h3 { font-size: 14px; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: 0.1em; }
        .seed-badge { background: #f0fdf4; color: #166534; padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: 12px; border: 1px solid #dcfce7; }

        .garden-view {
          background: linear-gradient(180deg, #ecfeff 0%, #f0fdf4 100%);
          height: 320px;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .grid-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px; opacity: 0.2; }
        
        .visual-stage { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; }
        .entity { font-size: 80px; transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: inline-block; cursor: default; }
        
        .stage-0 .entity { transform: scale(0.6); }
        .stage-1 .entity { transform: scale(0.8); }
        .stage-2 .entity { transform: scale(1.1); }
        .stage-3 .entity { transform: scale(1.4); }
        .stage-4 .entity { transform: scale(1.8); }

        .ground-shadow { width: 60px; height: 10px; background: rgba(0,0,0,0.1); border-radius: 50%; filter: blur(4px); margin-top: -10px; }
        .year-float { position: absolute; right: 20px; top: 20px; background: #fff; padding: 6px 12px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); font-weight: 800; color: #083344; }

        .garden-stats { z-index: 2; width: 100%; display: flex; flex-direction: column; gap: 8px; }
        .stat-row { display: flex; flex-direction: column; gap: 4px; }
        .stat-info { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #475569; }
        .bar-track { height: 6px; background: rgba(255,255,255,0.5); border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; transition: width 0.3s ease-out; }

        .slider-section { margin-top: 24px; }
        .slider-label { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 12px; }
        .garden-slider { width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; outline: none; -webkit-appearance: none; }
        .garden-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; background: #1e293b; border: 4px solid #fff; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.1); cursor: pointer; }
        .slider-ticks { display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-weight: 700; margin-top: 8px; }

        .garden-insight { margin-top: 20px; padding: 12px; background: #f8fafc; border-radius: 12px; font-size: 13px; color: #1e293b; border-left: 4px solid #1e293b; font-weight: 500; min-height: 50px; line-height: 1.5; }
      `}</style>
    </div>
  );
}
