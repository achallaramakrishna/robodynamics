"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/mindsutra/admin/dashboard");
        const json = await res.json();
        if (json.success) setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ color: "#818CF8", fontWeight: "bold", letterSpacing: "2px", animation: "pulse 2s infinite" }}>COMPILING DASHBOARD...</div>
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: "20px",
    padding: "24px",
    position: "relative",
    overflow: "hidden"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#F8FAFC", padding: "40px 20px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        table { border-collapse: collapse; min-width: 100%; }
        th { border-bottom: 1px solid #1E293B; color: #64748B; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px; text-align: left; }
        td { padding: 16px 12px; border-bottom: 1px solid #1E293B33; }
        tr:hover { background: #1E293B44; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: "40px", paddingBottom: "24px", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "36px", fontWeight: 900, background: "linear-gradient(to right, #818CF8, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MindSutra Admin</h1>
            <p style={{ margin: "4px 0 0", color: "#64748B", fontWeight: 600, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Real-time Championship Analytics</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(34, 197, 94, 0.1)", color: "#22C55E", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, border: "1px solid rgba(34, 197, 94, 0.2)" }}>
            <div style={{ width: "8px", height: "8px", background: "#22C55E", borderRadius: "50%", animation: "pulse 1.5s infinite" }} /> LIVE DATA
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          <div style={cardStyle}>
            <div style={{ color: "#64748B", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Total Participants</div>
            <div style={{ fontSize: "56px", fontWeight: 900 }}>{data?.stats?.totalStudents || 0}</div>
            <div style={{ position: "absolute", bottom: "-10px", right: "0px", fontSize: "100px", color: "white", opacity: 0.03, fontWeight: 900 }}>#</div>
          </div>
          <div style={cardStyle}>
            <div style={{ color: "#64748B", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Avg. Velocity</div>
            <div style={{ fontSize: "56px", fontWeight: 900, color: "#818CF8" }}>{data?.stats?.averageScore || 0}</div>
            <div style={{ position: "absolute", bottom: "-10px", right: "10px", fontSize: "100px", color: "#818CF8", opacity: 0.1, fontWeight: 900 }}>~</div>
          </div>
          <div style={{ ...cardStyle, background: "linear-gradient(135deg, #312E81, #581C87)", borderColor: "rgba(168, 85, 247, 0.3)" }}>
            <div style={{ color: "#E0E7FF", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Peak Velocity</div>
            <div style={{ fontSize: "56px", fontWeight: 900 }}>{data?.stats?.highestScore || 0}</div>
            <div style={{ position: "absolute", bottom: "-10px", right: "0px", fontSize: "100px", color: "#C084FC", opacity: 0.2, fontWeight: 900 }}>★</div>
          </div>
        </div>

        {/* Tables Container */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={cardStyle}>
               <h3 style={{ margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
                 <div style={{ width: "4px", height: "16px", background: "#818CF8", borderRadius: "10px" }} /> Grade Demographics
               </h3>
               <div style={{ display: "grid", gap: "16px" }}>
                  {data?.byGrade?.map((g: any) => (
                    <div key={g.grade}>
                       <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
                          <span>Class {g.grade}</span>
                          <span style={{ color: "#818CF8" }}>{g.count}</span>
                       </div>
                       <div style={{ height: "6px", background: "#020617", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ height: "100%", background: "linear-gradient(to right, #4F46E5, #9333EA)", width: `${(g.count/data.stats.totalStudents)*100}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div style={{ ...cardStyle, flex: 1, display: "flex", flexDirection: "column" }}>
               <h3 style={{ margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", color: "#C084FC" }}>
                 🏆 City Leaderboard (Top 20)
               </h3>
               <div style={{ display: "grid", gap: "10px", overflowY: "auto", maxHeight: "500px", paddingRight: "8px" }}>
                  {data?.leaders?.map((l: any, i: number) => (
                    <div key={i} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      background: i < 3 ? "rgba(192, 132, 252, 0.05)" : "#02061733", 
                      padding: "12px", 
                      borderRadius: "12px", 
                      border: i < 3 ? "1px solid rgba(192, 132, 252, 0.3)" : "1px solid #1E293B" 
                    }}>
                       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ 
                            width: "28px", 
                            height: "28px", 
                            borderRadius: "50%", 
                            background: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#1E293B", 
                            color: i < 3 ? "#000" : "#64748B",
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 900
                          }}>
                            {i+1}
                          </div>
                          <div>
                             <div style={{ fontWeight: 800, fontSize: "14px", color: i < 3 ? "#F8FAFC" : "#CBD5E1" }}>{l.student_name}</div>
                             <div style={{ fontSize: "11px", color: "#64748B" }}>{l.school_name || "Individual"} • Class {l.grade}</div>
                          </div>
                       </div>
                       <div style={{ fontWeight: 900, color: i < 3 ? "#C084FC" : "#818CF8", fontSize: i < 3 ? "18px" : "14px" }}>{l.velocity_score}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div style={cardStyle}>
             <h3 style={{ margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
                <div style={{ width: "4px", height: "16px", background: "#C084FC", borderRadius: "10px" }} /> Recent Registrations
             </h3>
             <div style={{ overflowX: "auto" }}>
               <table>
                  <thead>
                     <tr>
                        <th>Student / School</th>
                        <th>Parent Contact</th>
                        <th style={{ textAlign: "center" }}>Score</th>
                        <th style={{ textAlign: "right" }}>Time</th>
                     </tr>
                  </thead>
                  <tbody>
                     {data?.recent?.map((r: any) => (
                       <tr key={r.id}>
                          <td>
                             <div style={{ fontWeight: 800, color: "#F8FAFC" }}>{r.student_name}</div>
                             <div style={{ fontSize: "11px", color: "#64748B", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.school_name || "---"}</div>
                          </td>
                          <td>
                             <div style={{ fontSize: "13px", fontWeight: 600 }}>{r.parent_name}</div>
                             <div style={{ fontSize: "11px", color: "#818CF8", fontFamily: "monospace" }}>{r.phone}</div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                             {r.velocity_score > 0 ? (
                               <span style={{ background: "#C084FC1A", color: "#C084FC", padding: "4px 8px", borderRadius: "6px", fontWeight: 900, border: "1px solid #C084FC33" }}>{r.velocity_score}</span>
                             ) : (
                               <span style={{ color: "#334155", fontSize: "12px", fontStyle: "italic" }}>Pending</span>
                             )}
                          </td>
                          <td style={{ textAlign: "right", color: "#475569", fontSize: "11px" }}>
                             {new Date(r.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
