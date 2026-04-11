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
      setWallet(data.balance);
    } catch (e) {
      console.error("Failed to fetch wallet", e);
    }
  };

  const fetchAccounts = async () => {
    try {
      const resp = await fetch(`${API_BASE}/bank/accounts/${userId}`);
      const data = await resp.json();
      setAccounts(data);
      if (data.length > 0) setSelectedAccount(data[0]);
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
        background: '#0ea5e9',
        height: '240px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        border: '4px solid #0c4a6e',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div className="animate-pulse">PROCESSING...</div>
        ) : (
          <>
            {screen === 'WELCOME' && (
              <>
                <h2 style={{ fontSize: '24px', margin: 0 }}>ROBO BANK ATM</h2>
                <p>PLEASE INSERT CARD</p>
                <button 
                  onClick={() => setScreen('PIN')}
                  style={{ background: '#fff', color: '#0ea5e9', border: 'none', padding: '10px 20px', borderRadius: 20, fontWeight: 'bold', cursor: 'pointer' }}
                >
                  INSERT CARD
                </button>
              </>
            )}

            {screen === 'PIN' && (
              <>
                <p>ENTER YOUR 4-DIGIT PIN</p>
                <div style={{ fontSize: '32px', letterSpacing: '10px' }}>
                  {pin.split('').map(() => '*').join('')}
                </div>
                <p style={{ color: '#fed7aa', fontSize: '12px' }}>{message}</p>
              </>
            )}

            {screen === 'MENU' && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => setScreen('BALANCE')} style={menuButtonStyle}>CHECK BALANCE</button>
                <button onClick={() => setScreen('WITHDRAW')} style={menuButtonStyle}>CASH WITHDRAWAL</button>
                <button onClick={() => setScreen('WELCOME')} style={menuButtonStyle}>EXIT</button>
              </div>
            )}

            {screen === 'BALANCE' && (
              <>
                <p>YOUR CURRENT BALANCE</p>
                <h2 style={{ fontSize: '36px' }}>₹{selectedAccount?.balance}</h2>
                <button onClick={() => setScreen('MENU')} style={menuButtonStyle}>BACK</button>
              </>
            )}

            {screen === 'WITHDRAW' && (
              <>
                <p>ENTER AMOUNT TO WITHDRAW</p>
                <div style={{ fontSize: '32px' }}>₹{amount}</div>
                <p style={{ color: '#fed7aa', fontSize: '12px' }}>{message}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setScreen('MENU')} style={menuButtonStyle}>CANCEL</button>
                </div>
              </>
            )}

            {screen === 'SUCCESS' && (
              <>
                <div style={{ fontSize: '48px' }}>💰</div>
                <p>TRANSACTION SUCCESSFUL!</p>
                <p>NEW BALANCE: ₹{balance}</p>
                <button onClick={() => setScreen('WELCOME')} style={menuButtonStyle}>TAKE CASH & EXIT</button>
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
