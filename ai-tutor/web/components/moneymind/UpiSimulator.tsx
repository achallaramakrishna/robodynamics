"use client";

import React, { useState, useEffect } from 'react';

const API_BASE = "/api/moneymind";

export default function UpiSimulator({ userId = 101 }) {
  const [step, setStep] = useState('SCAN'); // SCAN, PAY, PIN, SUCCESS
  const [merchants, setMerchants] = useState<any[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txnDetails, setTxnDetails] = useState<any>(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const resp = await fetch(`${API_BASE}/merchants`);
      const data = await resp.json();
      setMerchants(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleScan = (merchant: any) => {
    setSelectedMerchant(merchant);
    setStep('PAY');
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`${API_BASE}/upi/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          vpa: selectedMerchant.vpa,
          amount: Number(amount),
          pin: pin
        })
      });
      const data = await resp.json();
      if (resp.ok) {
        setTxnDetails(data);
        setStep('SUCCESS');
      } else {
        setError(data.detail || "Payment Failed");
        setStep('PAY');
        setPin('');
      }
    } catch (e) {
      setError("Network Error");
    }
    setLoading(false);
  };

  return (
    <div style={{
      width: '360px',
      height: '640px',
      background: '#fff',
      borderRadius: '40px',
      boxShadow: '0 0 0 12px #1e293b, 0 20px 50px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Phone Header */}
      <div style={{ height: '40px', background: '#1e293b', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '5px' }}>
        <div style={{ width: '60px', height: '15px', background: '#0f172a', borderRadius: '10px' }}></div>
      </div>

      {/* App Content */}
      <div style={{ height: 'calc(100% - 40px)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        
        {step === 'SCAN' && (
          <>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>Scan QR to Pay</h2>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Select a merchant to simulate scanning their QR code.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {merchants.map(m => (
                <div 
                  key={m.id}
                  onClick={() => handleScan(m)}
                  style={{
                    background: '#f1f5f9',
                    padding: '15px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    {m.category === 'Food' ? '🍹' : m.category === 'Stationery' ? '📚' : '🧸'}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>{m.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{m.vpa}</div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 'auto', background: '#eff6ff', padding: '15px', borderRadius: '12px', color: '#1e40af', fontSize: '12px' }}>
              <strong>Tip:</strong> Always double check the name on the screen before entering your PIN!
            </div>
          </>
        )}

        {step === 'PAY' && (
          <>
            <button onClick={() => setStep('SCAN')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textAlign: 'left', marginBottom: '20px' }}>← Back</button>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '32px' }}>
                👤
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Paying {selectedMerchant?.name}</h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{selectedMerchant?.vpa}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px' }}>Amount to Pay</label>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #3b82f6', paddingBottom: '10px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '5px' }}>₹</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  style={{ fontSize: '32px', fontWeight: 'bold', width: '100%', border: 'none', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px' }}>Enter 4-Digit UPI PIN (Try 9999)</label>
              <input 
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
                style={{ fontSize: '24px', letterSpacing: '10px', width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}
              />
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>{error}</p>}

            <button 
              disabled={loading || !amount || pin.length < 4}
              onClick={handlePayment}
              style={{
                marginTop: 'auto',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '15px',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: (loading || !amount || pin.length < 4) ? 0.6 : 1
              }}
            >
              {loading ? 'PROCESSING...' : `PROCEED TO PAY ₹${amount}`}
            </button>
          </>
        )}

        {step === 'SUCCESS' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', background: '#10b981', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', color: '#fff', marginBottom: '20px', animation: 'scaleUp 0.5s ease-out' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Payment Successful</h2>
            <p style={{ fontSize: '32px', fontWeight: '900', color: '#10b981', margin: '10px 0' }}>₹{amount}</p>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Paid to {txnDetails?.merchant}</p>
            <div style={{ margin: '20px 0', padding: '10px', background: '#f8fafc', borderRadius: '8px', width: '100%' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>TRANSACTION ID</div>
              <div style={{ fontSize: '12px', fontWeight: 'mono' }}>{txnDetails?.txnId}</div>
            </div>
            <button 
              onClick={() => {
                setStep('SCAN');
                setAmount('');
                setPin('');
              }}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
            >
              DONE
            </button>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes scaleUp {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
