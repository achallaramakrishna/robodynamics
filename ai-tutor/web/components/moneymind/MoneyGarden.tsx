"use client";

import React, { useState, useMemo } from "react";
import "./MoneyMindBoard.css";

const ANNUAL_RATE = 0.12; // 12% growth (Aggressive/Equity style)
const INITIAL_SEED = 1000;

export default function MoneyGarden() {
  const [years, setYears] = useState(0);

  const stats = useMemo(() => {
    const compounding = INITIAL_SEED * Math.pow(1 + ANNUAL_RATE, years);
    const simple = INITIAL_SEED * (1 + ANNUAL_RATE * years);
    const savings = INITIAL_SEED; // Cash in hand
    return {
      compounding: Math.round(compounding),
      simple: Math.round(simple),
      savings: Math.round(savings)
    };
  }, [years]);

  // Determine tree stage index (0 to 4)
  const treeStage = years === 0 ? 0 : 
                    years < 5 ? 1 :
                    years < 12 ? 2 :
                    years < 22 ? 3 : 4;

  const STAGE_LABELS = ["Seedling", "Sprout", "Sapling", "Grown Tree", "Orchard"];

  return (
    <div className="money-garden-container">
      <div className="garden-header">
        <h3>L5 LAB: The Compounding Garden</h3>
        <div className="seed-badge">Initial Seed: ₹{INITIAL_SEED}</div>
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
          <div className="stat-row">
            <div className="stat-info">
              <span className="label">Wealth Tree (12%)</span>
              <span className="value positive">₹{stats.compounding.toLocaleString()}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill compound" style={{ width: `${Math.min(100, (stats.compounding / 30000) * 100)}%` }}></div>
            </div>
          </div>
          
          <div className="stat-row">
            <div className="stat-info">
              <span className="label">Simple Growth</span>
              <span className="value">₹{stats.simple.toLocaleString()}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill simple" style={{ width: `${Math.min(100, (stats.simple / 30000) * 100)}%` }}></div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-info">
              <span className="label">Piggy Bank (Cash)</span>
              <span className="value">₹{stats.savings.toLocaleString()}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill cash" style={{ width: `${Math.min(100, (stats.savings / 30000) * 100)}%` }}></div>
            </div>
          </div>
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
          max="30" 
          value={years} 
          onChange={(e) => setYears(parseInt(e.target.value))}
          className="garden-slider"
        />
        <div className="slider-ticks">
          <span>Today</span>
          <span>10y</span>
          <span>20y</span>
          <span>30y</span>
        </div>
      </div>

      <div className="garden-insight">
        {years === 0 && "Plant your ₹1,000 seed and move the slider to see the future."}
        {years > 0 && years < 7 && `In ${years} years, your money is growing slowly but surely.`}
        {years >= 7 && years < 15 && `Year 7 Milestone: Your seed has already doubled! It's now ₹${stats.compounding.toLocaleString()}.`}
        {years >= 15 && years < 25 && "Notice the gap! The Wealth Tree is now growing much faster than the Piggy Bank."}
        {years >= 25 && "Absolute Power: At Year 30, your ₹1,000 has become nearly 30x bigger! That's the magic of compounding."}
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
          height: 280px;
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
        .value.positive { color: #10b981; font-weight: 900; }
        .bar-track { height: 6px; background: rgba(255,255,255,0.5); border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; transition: width 0.3s ease-out; }
        .bar-fill.compound { background: #10b981; }
        .bar-fill.simple { background: #3b82f6; }
        .bar-fill.cash { background: #94a3b8; }

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
