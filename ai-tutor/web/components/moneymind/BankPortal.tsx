"use client";

import React, { useState, useEffect } from 'react';

const API_BASE = "/api/moneymind";

export default function BankPortal({ userId = 1 }) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, [userId]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/bank/accounts/${userId}`);
      const data = await resp.json();
      setAccounts(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

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
      setTransactions(data);
    } catch (e) {
      console.error(e);
    }
  };

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
