"use client";

import React, { useState } from "react";
import "./MoneyMindBoard.css";

type Chore = {
  id: string;
  task: string;
  reward: number;
  status: "PENDING" | "COMPLETED" | "PAID";
};

type Reward = {
  id: string;
  label: string;
  cost: number;
  progress: number;
};

export default function ParentDashboard({ userId }: { userId: number }) {
  const [isAdmin, setIsAdmin] = useState(false); // Toggle between Parent and Student view
  const [chores, setChores] = useState<Chore[]>([
    { id: "1", task: "Clean the study table", reward: 20, status: "PENDING" },
    { id: "2", task: "Read 10 pages of a book", reward: 50, status: "COMPLETED" },
    { id: "3", task: "Organize the toy box", reward: 30, status: "PAID" },
  ]);

  const [dreamReward, setDreamReward] = useState<Reward>({
    id: "r1",
    label: "New Gaming Mouse",
    cost: 1500,
    progress: 450
  });

  const toggleStatus = (id: string) => {
    if (!isAdmin) return; // Only parent can approve/pay
    setChores(prev => prev.map(c => {
      if (c.id === id) {
        if (c.status === "PENDING") return { ...c, status: "COMPLETED" };
        if (c.status === "COMPLETED") return { ...c, status: "PAID" };
        return c;
      }
      return c;
    }));
  };

  const totalEarned = chores.filter(c => c.status === "PAID").reduce((sum, c) => sum + c.reward, 0);

  return (
    <div className="parent-dashboard-container">
      <div className="dashboard-nav">
        <div className="dash-identity">
          <span className="icon">👨‍👩‍👧</span>
          <h3>Family Wealth Board</h3>
        </div>
        <button 
          className={`mode-toggle ${isAdmin ? "admin" : ""}`} 
          onClick={() => setIsAdmin(!isAdmin)}
        >
          {isAdmin ? "Parent Mode: ON" : "Student View"}
        </button>
      </div>

      {!isAdmin ? (
        /* --- STUDENT VIEW --- */
        <div className="dash-view student-view">
          <div className="wallet-card">
            <span className="wallet-label">Your Wallet Balance</span>
            <div className="wallet-amount">₹{totalEarned}</div>
            <p className="wallet-hint">Earn more by completing today's chores!</p>
          </div>

          <div className="dream-card">
            <div className="dream-header">
              <span>Goal: {dreamReward.label}</span>
              <strong>{Math.round((dreamReward.progress / dreamReward.cost) * 100)}%</strong>
            </div>
            <div className="dream-bar-track">
              <div className="dream-bar-fill" style={{ width: `${(dreamReward.progress / dreamReward.cost) * 100}%` }}></div>
            </div>
            <span className="dream-footer">₹{dreamReward.cost - dreamReward.progress} more to go!</span>
          </div>

          <div className="chore-list">
            <h4>Available Chores</h4>
            {chores.filter(c => c.status !== "PAID").map(c => (
              <div key={c.id} className="chore-item">
                <span className="chore-task">{c.task}</span>
                <div className="chore-meta">
                  <span className="chore-reward">+₹{c.reward}</span>
                  <span className={`chore-status ${c.status.toLowerCase()}`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* --- PARENT MODE --- */
        <div className="dash-view parent-view">
          <div className="parent-alert">
            <span className="icon">🔑</span>
            <p>You are in <strong>Parent Mode</strong>. You can approve tasks and release rewards here.</p>
          </div>

          <div className="approval-list">
            <h4>Pending Approvals</h4>
            {chores.filter(c => c.status !== "PAID").map(c => (
              <div key={c.id} className="approval-item">
                <div className="item-main">
                  <strong>{c.task}</strong>
                  <span className="item-sub">Reward: ₹{c.reward}</span>
                </div>
                {c.status === "PENDING" ? (
                  <button onClick={() => toggleStatus(c.id)} className="btn-approve">Mark Completed</button>
                ) : (
                  <button onClick={() => toggleStatus(c.id)} className="btn-pay">Release Payment</button>
                )}
              </div>
            ))}
          </div>

          <div className="quick-add">
            <input type="text" placeholder="Add new task (e.g. Wash the car)" />
            <div className="add-controls">
                <input type="number" placeholder="₹" style={{ width: 60 }} />
                <button className="btn-create">Create Task</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .parent-dashboard-container {
          width: 100%;
          min-height: 500px;
          background: #f8fafc;
          border-radius: 24px;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }

        .dashboard-nav {
          padding: 20px;
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }
        .dash-identity { display: flex; align-items: center; gap: 10px; }
        .dash-identity .icon { font-size: 24px; }
        .dash-identity h3 { font-size: 16px; font-weight: 800; color: #1e293b; margin: 0; }

        .mode-toggle {
          padding: 8px 16px;
          border-radius: 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mode-toggle.admin { background: #fee2e2; color: #991b1b; border-color: #fecaca; }

        .dash-view { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 20px; }

        /* --- STUDENT ITEMS --- */
        .wallet-card {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 24px;
          border-radius: 20px;
          color: white;
          text-align: center;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }
        .wallet-label { font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.1em; }
        .wallet-amount { font-size: 42px; font-weight: 900; margin: 10px 0; }
        .wallet-hint { font-size: 11px; opacity: 0.8; }

        .dream-card {
           background: #fff;
           padding: 20px;
           border-radius: 20px;
           box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .dream-header { display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 12px; }
        .dream-bar-track { height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden; margin-bottom: 8px; }
        .dream-bar-fill { height: 100%; background: #3b82f6; border-radius: 6px; }
        .dream-footer { font-size: 11px; color: #64748b; font-weight: 600; }

        .chore-list h4 { font-size: 14px; color: #475569; margin-bottom: 12px; }
        .chore-item {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chore-task { font-size: 13px; font-weight: 600; color: #1e293b; }
        .chore-meta { display: flex; align-items: center; gap: 12px; }
        .chore-reward { font-size: 14px; font-weight: 800; color: #10b981; }
        .chore-status { font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; }
        .chore-status.pending { background: #fefce8; color: #854d0e; }
        .chore-status.completed { background: #eff6ff; color: #1e40af; }

        /* --- PARENT ITEMS --- */
        .parent-alert {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #64748b;
          border-left: 4px solid #ef4444;
        }
        .approval-list h4 { font-size: 14px; color: #475569; margin-bottom: 12px; }
        .approval-item {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideIn 0.3s ease-out;
        }
        .item-main { display: flex; flex-direction: column; }
        .item-sub { font-size: 11px; color: #94a3b8; }
        .btn-approve { background: #3b82f6; color: white; border: none; padding: 10px 15px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; }
        .btn-pay { background: #10b981; color: white; border: none; padding: 10px 15px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; }

        .quick-add { margin-top: auto; background: #fff; padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 10px; border: 1px dashed #cbd5e1; }
        .quick-add input { padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; }
        .add-controls { display: flex; gap: 10px; }
        .btn-create { flex: 1; background: #1e293b; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; }

        @keyframes slideIn {
           from { transform: translateX(20px); opacity: 0; }
           to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
