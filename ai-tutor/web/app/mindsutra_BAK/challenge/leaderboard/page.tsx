"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MindSutraBrandFooter, MindSutraBrandHeader } from "@/components/mindsutra/BrandChrome";

function LeaderboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gradeFilter = searchParams.get("grade") || "";

  const [data, setData] = useState<{students: any[], schools: any[]}>({ students: [], schools: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const url = `/api/mindsutra/challenge/leaderboard${gradeFilter ? `?grade=${gradeFilter}` : ""}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gradeFilter]);

  const setGrade = (g: string) => {
    const params = new URLSearchParams(window.location.search);
    if (g) params.set("grade", g);
    else params.delete("grade");
    router.push(`/mindsutra/challenge/leaderboard?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-6 md:p-12 font-sans selection:bg-purple-500/30">
      
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="z-10 max-w-5xl w-full">
        {/* Header */}
        <div className="mb-12">
          <MindSutraBrandHeader
            eyebrow="RoboDynamics"
            title="City Rankings"
            subtitle="Mindsutra founding beta • LIVE activity"
            compact
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
             <button onClick={() => router.push("/mindsutra/challenge")} className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 hover:text-purple-300 transition-colors">
               ← Back to Challenge
             </button>
             <button 
                onClick={() => {
                  const text = `Check out the Mindsutra founding beta activity board: https://robodynamics.in/mindsutra/challenge/leaderboard`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="mt-6 inline-flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] px-4 py-2 rounded-xl text-xs font-bold border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all"
             >
               <span className="text-lg">📱</span> Share Board to WhatsApp
             </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["", "5", "6", "7", "8", "9", "10"].map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  gradeFilter === g 
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {g === "" ? "OVERALL" : `CLASS ${g}`}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          
          {/* Top Students Card */}
          <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-neutral-800/50 bg-neutral-900/20 flex items-center justify-between">
               <h2 className="text-xl font-bold flex items-center gap-3">
                 <span className="text-2xl">🏆</span> 
                 {gradeFilter ? `Class ${gradeFilter} Early Families` : "Early Families"}
               </h2>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
                 Velocity Scores
               </span>
            </div>

            <div className="p-4 md:p-8">
              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4 text-neutral-500 animate-pulse">
                  <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold tracking-widest">TRANSMITTING DATA...</span>
                </div>
              ) : data.students.length > 0 ? (
                <div className="space-y-2">
                  {data.students.map((s, idx) => (
                    <div 
                      key={idx} 
                      className={`group flex items-center justify-between p-4 md:p-6 rounded-[1.5rem] transition-all duration-300 border ${
                        idx === 0 ? "bg-gradient-to-r from-purple-500/10 to-transparent border-purple-500/30" : 
                        "hover:bg-neutral-800/30 border-transparent hover:border-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-4 md:gap-8">
                         <div className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base ${
                           idx === 0 ? "bg-yellow-400 text-black" :
                           idx === 1 ? "bg-neutral-300 text-black" :
                           idx === 2 ? "bg-orange-400 text-black" :
                           "text-neutral-600 bg-neutral-900 border border-neutral-800"
                         }`}>
                           {idx + 1}
                         </div>
                         <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-lg md:text-xl group-hover:text-purple-400 transition-colors uppercase tracking-tight">{s.student_name}</h3>
                              <span className="px-2 py-0.5 bg-neutral-800 text-[10px] font-bold text-neutral-500 rounded-md">CLASS {s.grade}</span>
                            </div>
                            <p className="text-xs md:text-sm text-neutral-500 font-medium truncate max-w-[150px] md:max-w-none">{s.school_name || "Independent Scholar"}</p>
                         </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl md:text-4xl font-black tracking-tighter ${idx === 0 ? "text-purple-400" : "text-white"}`}>
                          {s.velocity_score}
                        </div>
                        <div className="text-[9px] md:text-[10px] font-black text-neutral-600 uppercase tracking-widest">Velocity</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-neutral-600">
                  <p className="text-sm italic">No rankings found for this category yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* School Rivalry Sidebar */}
          <div className="space-y-8">
            <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] p-8">
               <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
               <span className="text-xl">🏙️</span> School Activity
               </h2>
               <div className="space-y-4">
                  {data.schools.map((sch, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-neutral-950/50 rounded-2xl border border-neutral-800/50">
                       <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-white truncate max-w-[180px]">{sch.school_name}</span>
                          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{sch.participants} Active</span>
                       </div>
                       <div className="text-right">
                          <span className="text-lg font-black text-fuchsia-400">{sch.top_score}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

          <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-8 rounded-[2rem] text-center shadow-xl shadow-purple-900/20 group cursor-pointer" onClick={() => router.push("/auth/register?source=mindsutra")}>
               <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Enter Early Access</h3>
               <p className="text-white/70 text-sm mb-6 font-medium">Parents and students use the shared account to explore the beta first.</p>
               <div className="bg-white text-purple-600 font-bold py-3 rounded-xl group-hover:scale-105 transition-transform">
                 REGISTER
               </div>
            </div>

            <div className="text-center opacity-40 py-10">
               <img src="/rd-logo.png" alt="Logo" className="w-10 h-10 mx-auto mb-4 grayscale" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em]">Mindsutra Founding Beta</p>
            </div>
          </div>

        </div>

        <MindSutraBrandFooter
          note="Mindsutra by RoboDynamics"
          links={[
            { label: "Home", href: "/mindsutra" },
            { label: "Tutor", href: "/mindsutra/tutor" },
            { label: "Register", href: "/auth/register?source=mindsutra" },
            { label: "Challenge", href: "/mindsutra/challenge" },
          ]}
        />
      </div>
    </div>
  );
}

export default function PublicLeaderboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-purple-500 font-bold tracking-widest">INITIALIZING LEADERBOARD...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
