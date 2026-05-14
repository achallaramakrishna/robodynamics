"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MindSutraBrandFooter, MindSutraBrandHeader } from "@/components/mindsutra/BrandChrome";

export default function StudentScorecard() {
  const params = useParams();
  const router = useRouter();
  const phone = params.phone as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (phone) {
      fetch(`/api/mindsutra/challenge/profile?phone=${phone}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            setErrorMsg(data.error || "Profile unreachable.");
          }
          setLoading(false);
        })
        .catch(err => {
          setErrorMsg("Failed to connect to score server.");
          setLoading(false);
        });
    }
  }, [phone]);

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (errorMsg || !user) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white flex-col gap-4">
      <h2 className="text-2xl font-bold text-purple-400">Oops!</h2>
      <p className="text-neutral-400">{errorMsg || "Scorecard not found."}</p>
      <button onClick={() => router.push("/mindsutra/challenge")} className="mt-4 px-6 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-widest">Return to Dashboard</button>
    </div>
  );

  const shareToWhatsApp = () => {
    const text = `I just unlocked a MindSutra early access scorecard. Parents and students can register here: https://robodynamics.in/mindsutra`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-600 blur-[120px] rounded-full" />
      </div>

      {/* Scorecard Container */}
      <div className="w-full max-w-md mb-6 z-10">
        <MindSutraBrandHeader
          eyebrow="RoboDynamics"
          title="MindSutra Scorecard"
          subtitle="Verified founding beta access"
          compact
        />
      </div>

      <div 
        ref={cardRef}
        className="relative w-full max-w-md aspect-[4/5] bg-neutral-900 rounded-[2.5rem] border-4 border-neutral-800 shadow-[0_0_100px_rgba(147,51,234,0.1)] overflow-hidden flex flex-col items-center justify-between p-10 z-10"
      >
        {/* Design Elements */}
        <div className="absolute top-0 right-0 p-8">
           <div className="text-neutral-500 font-black text-4xl opacity-10 select-none">2026</div>
        </div>
        <div className="absolute bottom-0 left-0 p-8">
           <div className="text-neutral-500 font-black text-4xl opacity-10 select-none">ELITE</div>
        </div>

        {/* Brand */}
        <div className="text-center">
           <img src="/rd-logo.png" alt="Robo Dynamics" className="w-16 h-16 mx-auto mb-4 grayscale" />
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500">Mindsutra Founding Beta</h3>
        </div>

        {/* Student Profile */}
        <div className="text-center w-full">
           <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Official Results</p>
           <h1 className="text-3xl font-black text-white uppercase tracking-tight">{user.student_name}</h1>
           <div className="mt-2 h-[1px] w-12 bg-neutral-800 mx-auto" />
           <p className="text-[11px] text-neutral-500 mt-2 font-medium">{user.school_name || "Independent Scholar"}</p>
        </div>

        {/* Score Ring */}
        <div className="relative flex items-center justify-center py-6">
           {/* Glow Ring */}
           <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full" />
           <div className="relative border-4 border-purple-500/20 rounded-full w-44 h-44 flex flex-col items-center justify-center bg-neutral-950 shadow-inner">
              <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">Velocity</span>
              <span className="text-6xl font-black text-white">{user.velocity_score}</span>
              <div className="mt-2 flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none">Verified Score</span>
              </div>
           </div>
        </div>

        {/* Rank Badge */}
        <div className="flex flex-col items-center gap-2">
           <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-2 rounded-full font-black text-xs shadow-lg shadow-purple-900/40">
              CITY RANK: #{user.city_rank}
           </div>
           <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider mt-1">Founding Beta Access</p>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-neutral-800 w-full opacity-50">
           <p className="text-[9px] font-medium text-neutral-500">
             Scan to verify: robodynamics.in/challenge
           </p>
        </div>
      </div>

      {/* Sharing Controls */}
      <div className="mt-8 flex flex-col gap-4 w-full max-w-xs z-10">
         <button 
           onClick={() => router.push("/mindsutra/level-1")}
           className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2 text-sm animate-pulse"
         >
           ✨ Start MindSutra Level 1
         </button>
         <button 
           onClick={shareToWhatsApp}
           className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-sm"
         >
           📱 Share on WhatsApp
         </button>
         <div className="flex gap-3">
            <button 
              onClick={() => router.push("/mindsutra/challenge")}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl border border-neutral-800 transition-all text-xs"
            >
              Back to Arena
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl border border-neutral-800 transition-all text-xs"
            >
              Print Card
            </button>
         </div>
      </div>

      <div className="w-full max-w-md z-10">
        <MindSutraBrandFooter
          note="Mindsutra by RoboDynamics"
          links={[
            { label: "Challenge", href: "/mindsutra/challenge" },
            { label: "Tutor", href: "/mindsutra/tutor" },
            { label: "Register", href: "/auth/register?source=mindsutra" },
          ]}
        />
      </div>

      <p className="mt-12 text-[10px] text-neutral-600 font-bold uppercase tracking-[0.3em]">Mindsutra Early Access 2026</p>
    </div>
  );
}
