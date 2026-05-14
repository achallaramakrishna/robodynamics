"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MindSutraBrandFooter, MindSutraBrandHeader } from "@/components/mindsutra/BrandChrome";

export default function ChallengeLanding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formError, setFormError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    grade: "5",
    schoolName: "",
    password: "",
  });

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<{students: any[], schools: any[]}>({ students: [], schools: [] });

  // Check if already registered
  useEffect(() => {
    const saved = localStorage.getItem("ms_challenge_user");
    if (saved) {
      try {
        const userObj = JSON.parse(saved);
        setCurrentUser(userObj);

        // Sync fresh data from server (esp. score and rank)
        // If phone is missing, we still try to show what we have, 
        // but sync requires the phone ID.
        if (userObj.phone) {
          const sanitized = userObj.phone.trim();
          fetch(`/api/mindsutra/challenge/profile?phone=${encodeURIComponent(sanitized)}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.user) {
                const updated = { ...userObj, ...data.user };
                localStorage.setItem("ms_challenge_user", JSON.stringify(updated));
                setCurrentUser(updated);
              }
            })
            .catch(err => console.error("Profile sync failed:", err));
        } else {
          // AUTO-FIX: If phone is missing, the session is corrupted. 
          // Clear it to force a clean re-login.
          localStorage.removeItem("ms_challenge_user");
          setCurrentUser(null);
        }
      } catch (e) {
        console.error("Failed to parse local session:", e);
      }
    }

    // Fetch Leaderboard
    fetch("/api/mindsutra/challenge/leaderboard")
      .then(res => res.json())
      .then(data => {
        if (data.success) setLeaderboard({ students: data.students, schools: data.schools });
      });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formData.password.trim().length < 4) {
      setFormError("Please set a login password with at least 4 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/mindsutra/challenge/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Registration failed. Please check the details and try again.");
        return;
      }

      if (data.user) {
        localStorage.setItem("ms_challenge_user", JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error(err);
      setFormError("Registration failed. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = () => {
    // Lead to actual challenge interface (to be built next)
    router.push("/mindsutra/challenge/play");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 max-w-xl w-full">
        {/* Header */}
        <div className="mb-10">
          <MindSutraBrandHeader
            eyebrow="RoboDynamics"
            title="Mindsutra Early Access"
            subtitle="Register, open your founding beta access, and start exploring Mindsutra before paid plans begin."
          />
        </div>

        {/* Value Proposition */}
        {!currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 text-center">
            <div className="p-6 bg-neutral-900/30 rounded-2xl border border-neutral-800">
               <div className="text-3xl mb-3">⚡</div>
               <h4 className="font-bold text-white mb-1">Access</h4>
               <p className="text-xs text-neutral-500">Parents and students can join and start using the tutor flow immediately.</p>
            </div>
            <div className="p-6 bg-neutral-900/30 rounded-2xl border border-neutral-800">
               <div className="text-3xl mb-3">🧠</div>
               <h4 className="font-bold text-white mb-1">Parent Visibility</h4>
               <p className="text-xs text-neutral-500">One parent account can register a student and monitor progress later.</p>
            </div>
            <div className="p-6 bg-neutral-900/30 rounded-2xl border border-neutral-800">
               <div className="text-3xl mb-3">🏆</div>
               <h4 className="font-bold text-white mb-1">Fast Feedback</h4>
               <p className="text-xs text-neutral-500">We learn from early families before asking them to subscribe.</p>
            </div>
          </div>
        )}

        {/* Dynamic State: Dashboard vs Registration */}
        {currentUser ? (
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.student_name}!</h2>
            
            <div className="my-8 py-8 bg-neutral-950 rounded-2xl border border-purple-500/20 flex flex-col items-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Founding Beta Access</span>
               <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                {currentUser.velocity_score || 0}
              </span>
              
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="px-4 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold border border-purple-500/20">
                  Access Status: Active
                </span>
                <span className="px-4 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-full text-xs font-bold border border-fuchsia-500/20">
                  CLASS {currentUser.grade}
                </span>
              </div>
            </div>

            {currentUser.velocity_score === 0 ? (
              <p className="text-neutral-400 mb-6">Your early access is ready. Start with the first session or take the challenge now.</p>
            ) : (
              <div className="mb-6">
                <p className="text-neutral-400 text-sm mb-4">You have access. Want to continue where you left off?</p>
                <div className="flex gap-3">
                   <button 
                    onClick={() => {
                      const text = `I just joined the Mindsutra early access beta. Parents and students can register here: https://robodynamics.in/auth/register?source=mindsutra`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                    }}
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                   >
                     Share Invite
                   </button>
                   <button 
                    onClick={() => router.push(`/mindsutra/challenge/scorecard/${currentUser.phone}`)}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-purple-900/20"
                   >
                     Access Card
                   </button>
                   <button 
                    onClick={startChallenge}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl transition-all text-sm border border-neutral-700"
                   >
                     Enter Session
                   </button>
                </div>
              </div>
            )}

            <div className="mb-6 p-5 bg-neutral-950/70 border border-purple-500/20 rounded-2xl text-left">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-400 mb-3">Personal AI Tutor</div>
              <div className="text-white font-bold text-lg mb-2">{currentUser.tutor_stage || "Getting Started"}</div>
              <p className="text-neutral-400 text-sm leading-6 mb-4">
                {currentUser.tutor_summary || "The tutor is ready to capture a baseline and guide the next lesson."}
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-neutral-500 uppercase tracking-widest font-bold mb-1">Next Step</div>
                  <div className="text-neutral-200 font-medium leading-5">
                    {currentUser.tutor_next_step || "Start the foundation lesson and capture a baseline score."}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-neutral-500 uppercase tracking-widest font-bold mb-1">Focus Area</div>
                  <div className="text-neutral-200 font-medium leading-5">
                    {currentUser.tutor_focus_area || "Foundation and number sense"}
                  </div>
                </div>
              </div>
            </div>

            {currentUser.velocity_score === 0 && (
              <button 
                onClick={startChallenge}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
              >
                Enter Early Access
              </button>
            )}
            
            <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>Verified Participant: {currentUser.phone}</span>
              <button className="underline hover:text-neutral-300 font-medium" onClick={() => { localStorage.removeItem("ms_challenge_user"); setCurrentUser(null); }}>Switch Account</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Student Name</label>
                <input required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="Rohan S." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Parent Name</label>
                <input required value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="Mrs. Sharma" />
              </div>
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Phone Number (Login ID)</label>
                <input readOnly={loading} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="9876543210" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Grade</label>
                <select value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer">
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">School Name</label>
              <input value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="Delhi Public School, Bangalore South" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Login Password</label>
              <input readOnly={loading} required minLength={4} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} type="password" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="Minimum 4 characters" />
              <p className="text-[11px] text-neutral-500">Use this password later with the phone number to continue Mindsutra.</p>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                {formError}
              </div>
            )}

            <button 
              disabled={loading}
              type="submit" 
              className="w-full mt-4 bg-white hover:bg-neutral-200 text-neutral-950 font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="text-center text-xs text-neutral-500 mt-4">Account access opens immediately after registration.</p>
          </form>
        )}

        {/* --- LEADERBOARD SECTION --- */}
        <div className="mt-16 w-full space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Community Pulse</h2>
            <p className="text-neutral-500 text-sm">Early-access activity across founders, parents, and students</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Top Students */}
            {/* Rewards Section */}
              <div className="mt-20 py-16 px-8 bg-neutral-900/50 rounded-[3rem] border border-white/5 opacity-80 backdrop-blur-sm">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-black text-white mb-6">Built for Early Families</h2>
                    <p className="text-neutral-400 mb-12">Mindsutra opens first so parents can see the value before any payment begins.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                            <div className="text-2xl mb-3 font-bold text-purple-400">📜</div>
                            <h4 className="text-white font-bold text-sm mb-2">Access Card</h4>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-loose">Simple access proof for early families.</p>
                        </div>
                        <div className="p-6 bg-fuchsia-500/5 rounded-2xl border border-fuchsia-500/10">
                            <div className="text-2xl mb-3 font-bold text-fuchsia-400">🏆</div>
                            <h4 className="text-white font-bold text-sm mb-2">Feedback Loop</h4>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-loose">Parents shape the product before launch pricing.</p>
                        </div>
                        <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                            <div className="text-2xl mb-3 font-bold text-blue-400">🎓</div>
                            <h4 className="text-white font-bold text-sm mb-2">Future Upgrade</h4>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-loose">Paid plans begin after families have seen the value.</p>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/5">
                        <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.3em]">
                            Founding beta continues through: <span className="text-white">Soft launch period</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                <span className="text-xl">🏆</span> Early Families
              </h3>
              <div className="space-y-3">
                {leaderboard.students.length > 0 ? leaderboard.students.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-neutral-600 w-4">{idx + 1}</span>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{s.student_name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">{s.school_name || 'Individual'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-fuchsia-400">{s.velocity_score}</p>
                      <p className="text-[9px] text-neutral-600 font-mono">VELOCITY</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-neutral-600 py-10 text-sm italic">Activity will appear as founding families start registering...</p>
                )}
              </div>
            </div>

            {/* School Rivalry */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
                <span className="text-xl">🏙️</span> School Activity
              </h3>
              <div className="space-y-3">
                {leaderboard.schools.length > 0 ? leaderboard.schools.map((sch, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-neutral-600 w-4">{idx + 1}</span>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight truncate max-w-[150px]">{sch.school_name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">{sch.participants} Participants</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-purple-400">{sch.top_score}</p>
                      <p className="text-[9px] text-neutral-600 font-mono">PEAK SCORE</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-neutral-600 py-10 text-sm italic">School data accumulating...</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="py-20 text-center opacity-30 grayscale hover:opacity-100 transition-all duration-700">
             <img src="/rd-logo.png" alt="Robo Dynamics" className="w-12 h-12 mx-auto mb-4 filter drop-shadow-2xl" />
             <p className="text-[10px] tracking-[0.3em] font-black uppercase text-neutral-500">Mindsutra Founding Beta</p>
          </div>
        </div>

        <MindSutraBrandFooter
          note="Mindsutra by RoboDynamics"
          links={[
            { label: "Home", href: "/mindsutra" },
            { label: "Tutor", href: "/mindsutra/tutor" },
            { label: "Register", href: "/auth/register?source=mindsutra" },
            { label: "Leaderboard", href: "/mindsutra/challenge/leaderboard" },
          ]}
        />

      </div>
    </div>
  );
}
