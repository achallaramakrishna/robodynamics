"use client";

import React, { useState, useEffect } from 'react';

export default function PortfolioSandboxElite() {
  const [initialCapital] = useState(100000);
  const [stocks, setStocks] = useState(50);
  const [gold, setGold] = useState(20);
  const [fd, setFd] = useState(20);
  const [cash, setCash] = useState(10);

  const [wealth10Yr, setWealth10Yr] = useState(0);
  const [isCrashed, setIsCrashed] = useState(false);

  // Normal Avg Returns
  const returns = { stocks: 0.14, gold: 0.09, fd: 0.07, cash: 0.03 };

  useEffect(() => {
    // Total must be 100
    const total = stocks + gold + fd + cash;
    const sP = stocks / total;
    const gP = gold / total;
    const fP = fd / total;
    const cP = cash / total;

    // Compound 10 years: P * (1+r)^10
    const stockPart = (initialCapital * sP) * Math.pow(1 + returns.stocks, 10);
    const goldPart = (initialCapital * gP) * Math.pow(1 + returns.gold, 10);
    const fdPart = (initialCapital * fP) * Math.pow(1 + returns.fd, 10);
    const cashPart = (initialCapital * cP) * Math.pow(1 + returns.cash, 10);

    let totalWealth = stockPart + goldPart + fdPart + cashPart;
    
    if (isCrashed) {
      // In a crash: Stocks -40%, Gold +10%, FD/Cash stable
      const crashStock = (initialCapital * sP) * Math.pow(1 + returns.stocks, 9) * 0.6;
      const crashGold = (initialCapital * gP) * Math.pow(1 + returns.gold, 9) * 1.1;
      const crashFd = (initialCapital * fP) * Math.pow(1 + returns.fd, 9);
      const crashCash = (initialCapital * cP) * Math.pow(1 + returns.cash, 9);
      totalWealth = crashStock + crashGold + crashFd + crashCash;
    }

    setWealth10Yr(Math.round(totalWealth));
  }, [stocks, gold, fd, cash, isCrashed]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSlider = (type: string, val: number) => {
    // Basic balancing logic to keep total at 100 is complex for a quick demo, 
    // so we'll just show the distribution and use the total for ratios.
    if (type === 'stocks') setStocks(val);
    if (type === 'gold') setGold(val);
    if (type === 'fd') setFd(val);
    if (type === 'cash') setCash(val);
  };

  const totalAlloc = stocks + gold + fd + cash;

  return (
    <div style={{
      background: '#0F172A',
      borderRadius: '24px',
      padding: '32px',
      color: '#F8FAFC',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#10B981', letterSpacing: '-0.025em' }}>PORTFOLIO SANDBOX</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Elite Tier 2: Asset Allocation Lab</p>
        </div>
        <button 
          onClick={() => setIsCrashed(!isCrashed)}
          style={{ 
            background: isCrashed ? '#EF4444' : '#1E293B', 
            border: `1px solid ${isCrashed ? '#EF4444' : '#475569'}`, 
            padding: '8px 16px', 
            borderRadius: '12px', 
            fontSize: '11px', 
            fontWeight: 800, 
            color: '#fff', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isCrashed ? '🚨 MARKET CRASH ACTIVE' : '💥 TRIGGER MARKET CRASH'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Left Side: Allocation Sliders */}
        <div>
          <h4 style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#94A3B8', fontWeight: 800 }}>STRATEGIC ALLOCATION</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Stocks */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ color: '#10B981', fontWeight: 800 }}>EQUITY (STOCKS)</span>
                <span>{Math.round((stocks/totalAlloc)*100)}%</span>
              </div>
              <input type="range" min="0" max="100" value={stocks} onChange={(e) => handleSlider('stocks', Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
            </div>

            {/* Gold */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ color: '#F59E0B', fontWeight: 800 }}>GOLD (HEDGE)</span>
                <span>{Math.round((gold/totalAlloc)*100)}%</span>
              </div>
              <input type="range" min="0" max="100" value={gold} onChange={(e) => handleSlider('gold', Number(e.target.value))} style={{ width: '100%', accentColor: '#F59E0B' }} />
            </div>

            {/* FD */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ color: '#3B82F6', fontWeight: 800 }}>DEBT (FIXED DEPOSIT)</span>
                <span>{Math.round((fd/totalAlloc)*100)}%</span>
              </div>
              <input type="range" min="0" max="100" value={fd} onChange={(e) => handleSlider('fd', Number(e.target.value))} style={{ width: '100%', accentColor: '#3B82F6' }} />
            </div>

            {/* Cash */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ color: '#64748B', fontWeight: 800 }}>CASH / LIQUID</span>
                <span>{Math.round((cash/totalAlloc)*100)}%</span>
              </div>
              <input type="range" min="0" max="100" value={cash} onChange={(e) => handleSlider('cash', Number(e.target.value))} style={{ width: '100%', accentColor: '#64748B' }} />
            </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Estimated Wealth (10 Years)</span>
            <div style={{ fontSize: '42px', fontWeight: 950, color: isCrashed ? '#F87171' : '#10B981', margin: '12px 0' }}>
              {formatCurrency(wealth10Yr)}
            </div>
            <div style={{ fontSize: '12px', color: '#475569' }}>Initial Capital: {formatCurrency(initialCapital)}</div>
          </div>

          <div style={{ padding: '24px', borderRadius: '16px', background: isCrashed ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', border: `1px solid ${isCrashed ? '#EF4444' : '#10B981'}` }}>
            <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 800, color: isCrashed ? '#F87171' : '#10B981' }}>
              {isCrashed ? '🚨 CRASH ANALYSIS' : '✅ PERFORMANCE INSIGHT'}
            </h5>
            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', lineHeight: '1.6' }}>
              {isCrashed 
                ? (stocks > 60 ? "Your portfolio was hit hard because it was heavy on Equity. Gold and FDs helped cushion the fall." : "Excellent! Your diversified portfolio held strong despite the market crash.")
                : (stocks > 60 ? "High Growth: Your aggressive equity stance is generating massive long-term wealth." : "Conservative: You are safe, but losing out on high-growth compounding.")}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Visual Pie Representation */}
            <div style={{ height: '8px', flex: stocks, background: '#10B981', borderRadius: '4px' }} />
            <div style={{ height: '8px', flex: gold, background: '#F59E0B', borderRadius: '4px' }} />
            <div style={{ height: '8px', flex: fd, background: '#3B82F6', borderRadius: '4px' }} />
            <div style={{ height: '8px', flex: cash, background: '#475569', borderRadius: '4px' }} />
          </div>
        </div>
      </div>

      <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '11px', color: '#475569', fontStyle: 'italic' }}>
        "Diversification is the only free lunch in finance." — Harry Markowitz
      </p>
    </div>
  );
}
