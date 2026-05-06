"use client";

import React, { useState, useEffect } from 'react';

export default function SalaryDecoderElite() {
  const [ctc, setCtc] = useState(1200000); // 12 LPA default
  const [monthlyRent, setMonthlyRent] = useState(20000);
  
  // States for calculated values
  const [basic, setBasic] = useState(0);
  const [hra, setHra] = useState(0);
  const [special, setSpecial] = useState(0);
  const [epf, setEpf] = useState(0);
  const [tax, setTax] = useState(0);
  const [takeHome, setTakeHome] = useState(0);

  useEffect(() => {
    // Logic for Indian Salary Breakdown (Approximate)
    const monthlyGross = ctc / 12;
    const basicPay = monthlyGross * 0.4; // 40% of Gross
    const hraPay = basicPay * 0.4; // 40% of Basic (Non-metro)
    const specialPay = monthlyGross - basicPay - hraPay;
    
    // PF Calculation (12% of Basic)
    const epfDeduction = basicPay * 0.12;
    
    // Simplified New Tax Regime (FY 2024-25)
    // 0-3L: 0, 3-6L: 5%, 6-9L: 10%, 9-12L: 15%, 12-15L: 20%, 15L+: 30%
    const annualTaxable = ctc - 75000; // Standard deduction
    let annualTax = 0;
    if (annualTaxable > 1500000) annualTax += (annualTaxable - 1500000) * 0.3 + 150000;
    else if (annualTaxable > 1200000) annualTax += (annualTaxable - 1200000) * 0.2 + 90000;
    else if (annualTaxable > 900000) annualTax += (annualTaxable - 900000) * 0.15 + 45000;
    else if (annualTaxable > 600000) annualTax += (annualTaxable - 600000) * 0.1 + 15000;
    else if (annualTaxable > 300000) annualTax += (annualTaxable - 300000) * 0.05;
    
    const monthlyTax = annualTax / 12;
    const finalTakeHome = monthlyGross - epfDeduction - monthlyTax - 200; // 200 for PT

    setBasic(basicPay);
    setHra(hraPay);
    setSpecial(specialPay);
    setEpf(epfDeduction);
    setTax(monthlyTax);
    setTakeHome(finalTakeHome);
  }, [ctc]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const taxPercentage = (tax * 12 / ctc) * 100;

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
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#3B82F6', letterSpacing: '-0.025em' }}>SALARY ARCHITECT</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Elite Tier 3: Career Optimization Lab</p>
        </div>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3B82F6', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, color: '#3B82F6' }}>
          NEW REGIME (FY 2024-25)
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Left Side: Inputs */}
        <div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8' }}>ANNUAL CTC</label>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#F8FAFC' }}>{formatCurrency(ctc)}</span>
            </div>
            <input 
              type="range" min="300000" max="5000000" step="50000"
              value={ctc} onChange={(e) => setCtc(Number(e.target.value))}
              style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#334155', accentColor: '#3B82F6', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: '#475569', fontWeight: 700 }}>
              <span>3L</span>
              <span>12L</span>
              <span>25L</span>
              <span>50L</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: 800, color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>MONTHLY BREAKDOWN</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748B' }}>Basic Salary (40%)</span>
                <span style={{ fontWeight: 700 }}>{formatCurrency(basic)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748B' }}>HRA</span>
                <span style={{ fontWeight: 700 }}>{formatCurrency(hra)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748B' }}>Special Allowance</span>
                <span style={{ fontWeight: 700 }}>{formatCurrency(special)}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#F87171' }}>EPF Deduction</span>
                <span style={{ fontWeight: 700, color: '#F87171' }}>-{formatCurrency(epf)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#F87171' }}>Income Tax (TDS)</span>
                <span style={{ fontWeight: 700, color: '#F87171' }}>-{formatCurrency(tax)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Results & Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', borderRadius: '24px', padding: '32px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Monthly Take-Home</span>
            <div style={{ fontSize: '42px', fontWeight: 950, color: '#10B981', margin: '12px 0', textShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
              {formatCurrency(takeHome)}
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
              That's <strong>{Math.round((takeHome * 12 / ctc) * 100)}%</strong> of your total CTC.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 800, marginBottom: '4px' }}>EFFECTIVE TAX</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B' }}>{taxPercentage.toFixed(1)}%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 800, marginBottom: '4px' }}>EPF SAVINGS/YR</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#3B82F6' }}>{formatCurrency(epf * 12)}</div>
            </div>
          </div>

          <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 800, color: '#F59E0B' }}>💡 ELITE INSIGHT</h5>
            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', lineHeight: '1.6' }}>
              {ctc > 1500000 
                ? "You are in the 30% tax bracket. Focus on Tax-Free components like HRA and LTA to protect your wealth."
                : "Your tax rate is low. Use this surplus to start a high-growth Equity SIP immediately to beat inflation."}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
        <p style={{ margin: 0, fontSize: '11px', color: '#475569', fontStyle: 'italic' }}>
          *Calculation based on FY 2024-25 New Tax Regime including Standard Deduction of ₹75,000.
        </p>
      </div>
    </div>
  );
}
