"use client";

import React, { useState, useEffect } from 'react';

const API_BASE = "/api/moneymind";

export default function SavingsGoalTracker({ userId = 101 }) {
  const [goals, setGoals] = useState<any[]>([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  // New Goal Form
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [goalsResp, walletResp] = await Promise.all([
        fetch(`${API_BASE}/goals/${userId}`),
        fetch(`${API_BASE}/wallet/${userId}`)
      ]);
      const goalsData = await goalsResp.json();
      setGoals(Array.isArray(goalsData) ? goalsData : []);
      const walletData = await walletResp.json();
      setWallet(walletData?.balance ?? 0);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!goalName || !targetAmount) return;
    try {
      await fetch(`${API_BASE}/goal/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          goal_name: goalName,
          target_amount: Number(targetAmount)
        })
      });
      setShowCreate(false);
      setGoalName('');
      setTargetAmount('');
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddFunds = async (goalId: number, amount: number) => {
    try {
      const resp = await fetch(`${API_BASE}/goal/add_funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          goal_id: goalId,
          amount: amount
        })
      });
      if (resp.ok) fetchData();
      else {
        const err = await resp.json();
        alert(err.detail);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{
      background: '#fff',
      padding: '24px',
      borderRadius: '24px',
      color: '#1e293b',
      width: '100%',
      maxWidth: '600px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', margin: 0 }}>🎯 Savings Goals</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Save money to buy the things you love!</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + NEW GOAL
        </button>
      </div>

      {/* WALLET STATUS */}
      <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '16px', border: '1px solid #bae6fd', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0369a1' }}>💰 CASH IN YOUR POCKET:</span>
        <span style={{ fontSize: '20px', fontWeight: '900', color: '#0ea5e9' }}>₹{wallet}</span>
      </div>

      {showCreate && (
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>What are you saving for?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              placeholder="Goal Name (e.g. New Bicycle, Cricket Bat)" 
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              style={inputStyle}
            />
            <input 
              type="number"
              placeholder="Target Amount (₹)" 
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleCreate} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>CREATE</button>
              <button onClick={() => setShowCreate(false)} style={{ flex: 1, background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Updating goals...</p>
      ) : goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏁</div>
          <p>No goals yet. Create your first goal to start saving!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {goals.map(goal => {
            const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
            return (
              <div key={goal.id} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{goal.goal_name}</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>{pct}%</span>
                </div>
                
                {/* Progress Bar */}
                <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', marginBottom: '15px' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10b981' : '#3b82f6', transition: 'width 0.5s ease-out' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                  <span>₹{goal.current_amount} saved</span>
                  <span>Target: ₹{goal.target_amount}</span>
                </div>

                {pct < 100 ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleAddFunds(goal.id, 10)}
                      style={fundButtonStyle}
                    >
                      +₹10
                    </button>
                    <button 
                      onClick={() => handleAddFunds(goal.id, 50)}
                      style={fundButtonStyle}
                    >
                      +₹50
                    </button>
                    <button 
                      onClick={() => handleAddFunds(goal.id, 100)}
                      style={fundButtonStyle}
                    >
                      +₹100
                    </button>
                  </div>
                ) : (
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                    🎉 GOAL ACHIEVED!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '14px',
  outline: 'none'
};

const fundButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px',
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '13px'
};
