"use client";

import React, { useState, useEffect } from 'react';

const API_BASE = "/api/moneymind";

export default function AtmSimulator({ userId = 1 }) {
  const [screen, setScreen] = useState('WELCOME'); // WELCOME, PIN, MENU, WITHDRAW, SUCCESS, BALANCE
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  const fetchWallet = async () => {
    try {
      const resp = await fetch(`${API_BASE}/wallet/${userId}`);
      const data = await resp.json();
      setWallet(data?.balance ?? 0);
    } catch (e) {
      console.error("Failed to fetch wallet", e);
    }
  };

  const fetchAccounts = async () => {
    try {
      const resp = await fetch(`${API_BASE}/bank/accounts/${userId}`);
      const data = await resp.json();
      const accs = Array.isArray(data) ? data : [];
      setAccounts(accs);
      if (accs.length > 0) setSelectedAccount(accs[0]);
    } catch (e) {
      console.error("Failed to fetch accounts", e);
    }
  };

  const handlePinSubmit = () => {
    if (pin === '1234') {
      setLoading(true);
      fetchAccounts().then(() => {
        setScreen('MENU');
        setLoading(false);
      });
    } else {
      setMessage('INVALID PIN. TRY 1234');
      setPin('');
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/atm/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          account_id: selectedAccount.id,
          amount: Number(amount),
          description: "ATM Withdrawal"
        })
      });
      const data = await resp.json();
      if (resp.ok) {
        setBalance(data.new_balance);
        setWallet(data.wallet_balance);
        setScreen('SUCCESS');
      } else {
        setMessage(data.detail || "Error");
      }
    } catch (e) {
      setMessage("Connection Error");
    }
    setLoading(false);
  };

  const Keypad = ({ onKey }: { onKey: (key: string) => void }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 20 }}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'ENT'].map(key => (
        <button
          key={key}
          onClick={() => onKey(key)}
          style={{
            padding: '15px',
            background: '#334155',
            color: '#fff',
            border: '1px solid #475569',
            borderRadius: 8,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{
      background: '#1e293b',
      padding: '30px',
      borderRadius: '24px',
      width: '400px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '8px solid #475569',
      fontFamily: 'monospace'
    }}>
      {/* ATM SCREEN */}
      <div style={{
        background: '#0F172A',
        height: '260px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '24px',
        textAlign: 'center',
        border: '6px solid #334155',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
      }}>
        {/* Screen Header */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#334155', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', fontWeight: 800 }}>
          <span>ROBO-ATM v2.4</span>
          <span>SECURE CONNECTED</span>
        </div>

        {loading ? (
          <div style={{ animation: 'mmPulse 1s infinite' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
            <div style={{ fontWeight: 800, letterSpacing: 2 }}>PROCESSING...</div>
          </div>
        ) : (
          <>
            {screen === 'WELCOME' && (
              <>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>💳</div>
                <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 900, color: '#38BDF8' }}>WELCOME TO ROBO BANK</h2>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>Global ATM Network</p>
                <button 
                  onClick={() => setScreen('PIN')}
                  style={{ background: '#38BDF8', color: '#0F172A', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: '900', cursor: 'pointer', marginTop: '20px', boxShadow: '0 4px 15px rgba(56,189,248,0.4)' }}
                >
                  INSERT YOUR CARD
                </button>
              </>
            )}

            {screen === 'PIN' && (
              <>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔐</div>
                <p style={{ fontWeight: 800, letterSpacing: 1 }}>ENTER SECURE PIN</p>
                <div style={{ fontSize: '42px', letterSpacing: '12px', color: '#38BDF8', height: '50px' }}>
                  {pin.split('').map(() => '●').join('')}
                </div>
                <p style={{ color: '#F87171', fontSize: '11px', height: '14px' }}>{message}</p>
                <div style={{ fontSize: '10px', color: '#64748B', marginTop: '10px' }}>Use keypad to enter 4-digit code</div>
              </>
            )}

            {screen === 'MENU' && (
              <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: '20px' }}>
                <button onClick={() => setScreen('BALANCE')} style={menuButtonStyle}>💰 BALANCE</button>
                <button onClick={() => setScreen('WITHDRAW')} style={menuButtonStyle}>💵 WITHDRAW</button>
                <button onClick={() => setScreen('WELCOME')} style={{ ...menuButtonStyle, gridColumn: 'span 2', background: '#F87171' }}>✖ EXIT</button>
              </div>
            )}

            {screen === 'BALANCE' && (
              <>
                <p style={{ color: '#94A3B8' }}>AVAILABLE BALANCE</p>
                <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#4ADE80' }}>₹{selectedAccount?.balance?.toLocaleString()}</h2>
                <button onClick={() => setScreen('MENU')} style={{ ...menuButtonStyle, marginTop: '20px' }}>BACK TO MENU</button>
              </>
            )}

            {screen === 'WITHDRAW' && (
              <>
                <p style={{ fontWeight: 800 }}>ENTER AMOUNT</p>
                <div style={{ fontSize: '48px', color: '#FCD34D', fontWeight: 900 }}>₹{amount || '0'}</div>
                <p style={{ color: '#F87171', fontSize: '11px', height: '14px' }}>{message}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: '10px' }}>
                    <button onClick={() => setScreen('MENU')} style={menuButtonStyle}>CANCEL</button>
                </div>
              </>
            )}

            {screen === 'SUCCESS' && (
              <>
                <div style={{ fontSize: '64px', animation: 'mmPopIn 0.5s' }}>💵</div>
                <p style={{ fontWeight: 900, color: '#4ADE80' }}>DISPENSING CASH...</p>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>Collect your notes from the slot.</p>
                <button onClick={() => setScreen('WELCOME')} style={{ ...menuButtonStyle, marginTop: '15px', background: '#38BDF8' }}>FINISH & EXIT</button>
              </>
            )}
          </>
        )}
      </div>

      {/* KEYPAD AREA */}
      <Keypad onKey={(key) => {
        if (screen === 'PIN') {
          if (key === 'CLR') setPin('');
          else if (key === 'ENT') handlePinSubmit();
          else if (pin.length < 4) setPin(prev => prev + key);
        } else if (screen === 'WITHDRAW') {
          if (key === 'CLR') setAmount('');
          else if (key === 'ENT') handleWithdraw();
          else setAmount(prev => prev + key);
        }
      }} />

      {/* WALLET STATUS */}
      <div style={{ marginTop: '20px', padding: '15px', background: '#334155', borderRadius: '12px', color: '#94a3b8', fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>CASH IN POCKET:</span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>₹{wallet}</span>
        </div>
      </div>
    </div>
  );
}

const menuButtonStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.2)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.4)',
  padding: '10px',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'left',
  fontWeight: 'bold'
};
