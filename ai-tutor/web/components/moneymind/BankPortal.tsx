"use client";

import React, { useState, useEffect } from 'react';

const API_BASE = "/api/moneymind";

export default function BankPortal({ userId = 1, data = {} }: { userId?: number, data?: any }) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [vaultOpen, setVaultOpen] = useState(false);

  useEffect(() => {
    if (!data.view || data.view === 'accounts_list') {
      fetchAccounts();
    }
  }, [userId, data.view]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/bank/accounts/${userId}`);
      const data = await resp.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Render different views based on lesson data
  const view = data.view || 'accounts_list';

  if (view === 'vault_exterior') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: '#0F172A', borderRadius: '24px', border: '4px solid #334155', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <h2 style={{ color: '#FCD34D', marginBottom: '30px', fontWeight: 900, letterSpacing: 1.5 }}>🛡️ THE ROYAL VAULT</h2>
        <div style={{ position: 'relative', width: '280px', height: '280px', margin: '0 auto', transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', transform: vaultOpen ? 'rotate(10deg) scale(1.05)' : 'rotate(0) scale(1)', filter: vaultOpen ? 'drop-shadow(0 0 20px rgba(245,158,11,0.4))' : 'none' }}>
           <img src="/assets/moneymind/bank_vault_door_3d.png" alt="Vault Door" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
           {vaultOpen && (
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(16,185,129,0.9)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: '900', fontSize: '14px', zIndex: 10, animation: 'mmPopIn 0.5s' }}>
               OPENED
             </div>
           )}
        </div>
        <div style={{ marginTop: '40px' }}>
          <button 
            onClick={() => setVaultOpen(!vaultOpen)}
            style={{ background: '#F59E0B', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(245,158,11,0.5)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            {vaultOpen ? "CLOSE VAULT" : "ROTATE WHEEL TO OPEN"}
          </button>
        </div>
        {vaultOpen && (
          <div style={{ marginTop: '24px', color: '#10B981', fontWeight: '800', fontSize: '14px', animation: 'mmFadeIn 1s' }}>
            ✨ HIGH-SECURITY ACCESS GRANTED ✨
          </div>
        )}
      </div>
    );
  }

  if (view === 'account_form') {
    const [formSuccess, setFormSuccess] = useState(false);
    
    if (formSuccess) {
      return (
        <div style={{ background: '#F0FDF4', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '2px solid #BBF7D0' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎊</div>
          <h2 style={{ color: '#166534', fontWeight: 900 }}>CONGRATULATIONS!</h2>
          <p style={{ color: '#15803d', fontSize: '16px' }}>Your Student Savings Account is now ACTIVE.</p>
          <div style={{ marginTop: '30px', padding: '20px', background: '#fff', borderRadius: '16px', border: '1px dashed #BBF7D0', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800 }}>VIRTUAL ACCOUNT NO.</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1E293B', letterSpacing: 1 }}>MM-8834-7721</div>
          </div>
          <button onClick={() => setFormSuccess(false)} style={{ marginTop: '30px', background: '#10B981', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
            GO TO DASHBOARD
          </button>
        </div>
      );
    }

    return (
      <div style={{ background: '#fff', padding: '35px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0', maxWidth: '500px', margin: '0 auto' }}>
        {!creating ? (
          <>
            <h2 style={{ color: '#1E3A8A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 900 }}>
              <span style={{ fontSize: '28px' }}>🖋️</span> Create Savings Account
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {(data.fields || ["Full Name", "Date of Birth", "School Name", "Initial Deposit"]).map((f: string) => (
                <div key={f}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: 0.8 }}>{f}</label>
                  <input type="text" placeholder={`Enter ${f}...`} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #F1F5F9', outline: 'none', fontSize: '15px', color: '#1E293B' }} />
                </div>
              ))}
              <button 
                onClick={async () => {
                  setCreating(true);
                  try {
                    await createAccount('SAVINGS');
                    setFormSuccess(true);
                  } catch (e) {
                    console.error(e);
                    // Even if API fails, let's simulate success for the lesson experience
                    setTimeout(() => setFormSuccess(true), 1500);
                  }
                  setCreating(false);
                }}
                style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff', border: 'none', padding: '18px', borderRadius: '15px', fontWeight: '900', fontSize: '16px', marginTop: '10px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' }}
              >
                OPEN ACCOUNT NOW 🚀
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', animation: 'mmPopIn 1s infinite alternate' }}>🏦</div>
            <h3 style={{ color: '#1E3A8A', fontWeight: 900, marginTop: '20px' }}>Processing Application...</h3>
            <p style={{ color: '#64748B' }}>Meera is talking to the Bank Manager.</p>
          </div>
        )}
      </div>
    );
  }

  if (view === 'passbook_view') {
    const entries = data.entries || [{ date: "Today", detail: "Opening Balance", type: "CR", amount: 500 }];
    const total = entries.reduce((sum: number, e: any) => sum + e.amount, 0);
    return (
      <div style={{ background: '#FFFBEB', borderRadius: '24px', overflow: 'hidden', border: '3px solid #FDE68A', boxShadow: '0 15px 45px rgba(0,0,0,0.08)' }}>
        <div style={{ background: '#F59E0B', color: '#fff', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 }}>Official Document</div>
            <div style={{ fontSize: '22px', fontWeight: 900 }}>📘 Digital Passbook</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.9 }}>ACCOUNT TYPE</div>
            <div style={{ fontSize: '15px', fontWeight: 900 }}>SAVINGS</div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FEF3C7', color: '#92400E', fontSize: '11px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <th style={{ padding: '15px 20px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '15px 20px', textAlign: 'left' }}>Transaction Details</th>
              <th style={{ padding: '15px 20px', textAlign: 'right' }}>Type</th>
              <th style={{ padding: '15px 20px', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((en: any, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid #FEF3C7', background: i % 2 === 0 ? 'transparent' : '#FFFDF5' }}>
                <td style={{ padding: '15px 20px', color: '#92400E', fontWeight: 700 }}>{en.date}</td>
                <td style={{ padding: '15px 20px', color: '#1E293B', fontWeight: 600 }}>{en.detail}</td>
                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 900, background: en.type === 'CR' ? '#DCFCE7' : '#FEE2E2', color: en.type === 'CR' ? '#166534' : '#991B1B' }}>
                    {en.type === 'CR' ? 'DEPOSIT' : 'WITHDRAWAL'}
                  </span>
                </td>
                <td style={{ padding: '15px 20px', textAlign: 'right', color: en.type === 'CR' ? '#059669' : '#DC2626', fontWeight: 900, fontSize: '16px' }}>
                  ₹{en.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '30px', textAlign: 'center', background: '#FEF3C7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', color: '#92400E', fontWeight: '800', letterSpacing: 0.5 }}>NET BALANCE</div>
            <div style={{ fontSize: '32px', fontWeight: '950', color: '#92400E' }}>₹{total.toLocaleString()}</div>
          </div>
          <div style={{ background: '#FDE68A', padding: '10px 15px', borderRadius: '12px', color: '#92400E', fontWeight: 900, fontSize: '13px' }}>
             VERIFIED BY MEERA ✅
          </div>
        </div>
      </div>
    );
  }

  const createAccount = async (type: string) => {
    setCreating(true);
    try {
      await fetch(`${API_BASE}/bank/account/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, account_type: type })
      });
      fetchAccounts();
    } catch (e) {
      console.error(e);
    }
    setCreating(false);
  };

  const viewTransactions = async (account: any) => {
    setSelectedAccount(account);
    try {
      const resp = await fetch(`${API_BASE}/bank/transactions/${account.id}`);
      const data = await resp.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  // Default: Dashboard View
  return (
    <div style={{
      background: '#f8fafc',
      padding: '24px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      color: '#1e293b',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>🏫 Student Banking Portal</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            disabled={creating}
            onClick={() => createAccount('SAVINGS')}
            style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
          >
            + OPEN SAVINGS
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f1f5f9', borderRadius: '12px' }}>
          <p style={{ color: '#64748b' }}>No accounts found. Start your journey by opening a Savings account!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {accounts.map(acc => (
            <div 
              key={acc.id}
              onClick={() => viewTransactions(acc)}
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '16px',
                border: selectedAccount?.id === acc.id ? '2px solid #3b82f6' : '2px solid transparent',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{acc.account_type} ACCOUNT</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{acc.balance.toLocaleString()}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '12px' }}>{acc.account_number}</div>
            </div>
          ))}
        </div>
      )}

      {selectedAccount && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>Recent Transactions</h3>
          <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            {transactions.length === 0 ? (
              <p style={{ padding: '20px', color: '#64748b' }}>No transactions yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={tableHeaderStyle}>Date</th>
                    <th style={tableHeaderStyle}>Description</th>
                    <th style={tableHeaderStyle}>Type</th>
                    <th style={tableHeaderStyle}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(txn => (
                    <tr key={txn.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={tableCellStyle}>{new Date(txn.timestamp).toLocaleDateString()}</td>
                      <td style={tableCellStyle}>{txn.description}</td>
                      <td style={{ ...tableCellStyle, color: txn.transaction_type === 'CREDIT' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                        {txn.transaction_type}
                      </td>
                      <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>₹{txn.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '11px',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '13px',
  color: '#334155'
};
