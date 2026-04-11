"use client";

import React, { useState } from 'react';
import AtmSimulator from '../../components/moneymind/AtmSimulator';
import BankPortal from '../../components/moneymind/BankPortal';
import UpiSimulator from '../../components/moneymind/UpiSimulator';
import SavingsGoalTracker from '../../components/moneymind/SavingsGoalTracker';
import ParentDashboard from '../../components/moneymind/ParentDashboard';

export default function MoneyMindSimulator() {
  const [activeTab, setActiveTab] = useState<'ATM' | 'BANK' | 'UPI' | 'GOALS' | 'PARENT'>('BANK');
  const userId = 101; 

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 900, margin: 0 }}>
            MoneyMind <span style={{ color: '#f59e0b' }}>Virtual World</span>
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '10px' }}>
            Practice real financial transactions in a safe, simulated environment.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '12px', 
          marginBottom: '40px',
          background: '#1e293b',
          padding: '6px',
          borderRadius: '12px',
          width: 'fit-content',
          margin: '0 auto 40px'
        }}>
          <button onClick={() => setActiveTab('BANK')} style={tabButtonStyle(activeTab === 'BANK')}>🏫 BANK PORTAL</button>
          <button onClick={() => setActiveTab('ATM')} style={tabButtonStyle(activeTab === 'ATM')}>🏧 ATM SIMULATOR</button>
          <button onClick={() => setActiveTab('UPI')} style={tabButtonStyle(activeTab === 'UPI')}>📱 UPI LAB</button>
          <button onClick={() => setActiveTab('GOALS')} style={tabButtonStyle(activeTab === 'GOALS')}>🎯 GOALS</button>
          <button onClick={() => setActiveTab('PARENT')} style={tabButtonStyle(activeTab === 'PARENT')}>👨‍👩‍👧 PARENT MODE</button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {activeTab === 'ATM' && <div style={{ animation: 'fadeIn 0.3s' }}><AtmSimulator userId={userId} /></div>}
          {activeTab === 'BANK' && <div style={{ width: '100%', animation: 'fadeIn 0.3s' }}><BankPortal userId={userId} /></div>}
          {activeTab === 'UPI' && <div style={{ animation: 'fadeIn 0.3s' }}><UpiSimulator userId={userId} /></div>}
          {activeTab === 'GOALS' && <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.3s' }}><SavingsGoalTracker userId={userId} /></div>}
          {activeTab === 'PARENT' && <div style={{ width: '100%', animation: 'fadeIn 0.3s' }}><ParentDashboard userId={userId} /></div>}
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  background: isActive ? '#3b82f6' : 'transparent',
  color: isActive ? '#fff' : '#94a3b8',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '12px'
});
