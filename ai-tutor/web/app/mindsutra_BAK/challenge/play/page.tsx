"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { challengePool } from "@/lib/mindsutraChallengePool";
import { MindSutraBrandFooter, MindSutraBrandHeader } from "@/components/mindsutra/BrandChrome";

type GameState = "STARTING" | "PLAYING" | "FINISHED";

export default function ChallengePlayEngine() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [questions, setQuestions] = useState(challengePool);
  
  // Game States
  const [gameState, setGameState] = useState<GameState>("STARTING");
  const [countdown, setCountdown] = useState(3);
  
  // Question States
  const [qIndex, setQIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [velocityScore, setVelocityScore] = useState(0);
  const [feedback, setFeedback] = useState<"CORRECT" | "INCORRECT" | null>(null);
  const [qStartTime, setQStartTime] = useState<number>(0);
  
  // Global Timer State (5 Minutes = 300 seconds)
  const TOTAL_TIME = 300;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auth Check
    const saved = localStorage.getItem("ms_challenge_user");
    if (!saved) {
      router.push("/mindsutra/challenge");
      return;
    }
    setCurrentUser(JSON.parse(saved));

    // Shuffle and pick 30 questions for this session
    const shuffled = [...challengePool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 30);
    setQuestions(shuffled);

    // Countdown logic
    let c = 3;
    const interval = setInterval(() => {
      c--;
      if (c > 0) {
        setCountdown(c);
      } else {
        clearInterval(interval);
        setGameState("PLAYING");
        setQStartTime(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Global Timer Loop
  useEffect(() => {
    if (gameState !== "PLAYING") return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame(velocityScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, velocityScore]);

  // Auto focus input
  useEffect(() => {
    if (gameState === "PLAYING" && !feedback) {
      inputRef.current?.focus();
    }
  }, [gameState, feedback, qIndex]);


  const endGame = async (finalScore: number) => {
    setGameState("FINISHED");
    try {
      const res = await fetch("/api/mindsutra/challenge/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: currentUser.phone, velocityScore: finalScore }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        // Update local session
        const updatedUser = { ...currentUser, velocity_score: finalScore, city_rank: data.user.city_rank };
        localStorage.setItem("ms_challenge_user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }
    } catch (e) {
      console.error("Failed to save score");
    }
  };


  const [history, setHistory] = useState<any[]>([]);

  const evaluateAnswer = () => {
    if (!currentInput) return;
    const q = questions[qIndex];
    const isCorrect = currentInput.trim() === String(q.answer);
    const timeTakenSec = (Math.max(0, Date.now() - qStartTime)) / 1000;
    
    let newScore = velocityScore;
    
    if (isCorrect) {
      // Base Score
      let points = 200;
      // Speed Bonus
      let speedDiff = q.idealSeconds - timeTakenSec;
      if (speedDiff > 0) {
        points += Math.floor(speedDiff * 15);
      }
      newScore += points;
      setFeedback("CORRECT");
    } else {
      setFeedback("INCORRECT");
    }
    
    setVelocityScore(newScore);
    
    // Track History
    const perf = {
      qId: q.id,
      prompt: q.prompt,
      isCorrect,
      timeTaken: timeTakenSec,
      ideal: q.idealSeconds,
      sutra: q.sutra
    };
    setHistory(prev => [...prev, perf]);

    // Short delay before next question
    setTimeout(() => {
      setFeedback(null);
      setCurrentInput("");
      
      if (qIndex + 1 < questions.length) {
        setQIndex(qIndex + 1);
        setQStartTime(Date.now());
      } else {
        endGame(newScore);
      }
    }, 800);
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") evaluateAnswer();
  };

  const handleNumpad = (num: string) => {
    if (num === "DEL") setCurrentInput(prev => prev.slice(0, -1));
    else if (num === "ENT") evaluateAnswer();
    else setCurrentInput(prev => prev + num);
  };


  // --- RENDERS ---

  if (gameState === "STARTING") {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-6 left-6 right-6 z-10">
          <MindSutraBrandHeader
            eyebrow="RoboDynamics"
            title="MindSutra Challenge"
            subtitle="Founding beta session"
            compact
          />
        </div>
        <h2 className="text-2xl text-purple-400 mb-4 font-bold tracking-widest uppercase">Match Commencing</h2>
        <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500 animate-pulse">
          {countdown}
        </div>
      </div>
    );
  }
  const shareOnWhatsApp = () => {
    const text = `I just completed a Mindsutra early access challenge. Parents and students can register here: https://robodynamics.in/mindsutra`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (gameState === "FINISHED") {
    // Generate simple analysis
    const totalCorrect = history.filter(h => h.isCorrect).length;
    const slowQuestions = history.filter(h => h.isCorrect && h.timeTaken > h.ideal + 5);
    const topStruggle = slowQuestions.length > 0 ? slowQuestions[0] : null;

    // Derived Math Personality
    let personality = "The Strategist";
    if (totalCorrect > 12) personality = "MindSutra Sage";
    else if (totalCorrect >= 10) personality = "The Human Calculator";
    else if (history.every(h => h.isCorrect)) personality = "Precision Specialist";
    
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-6 left-6 right-6 z-10">
          <MindSutraBrandHeader
            eyebrow="RoboDynamics"
            title="MindSutra Challenge Complete"
            subtitle="Your score is ready to share"
            compact
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-neutral-950 to-neutral-950" />
        
        <div className="z-10 bg-neutral-900/60 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl shadow-purple-900/20">
          <div className="mb-4 inline-block px-4 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold border border-purple-500/40 uppercase tracking-widest leading-none">
            {personality}
          </div>
          <h2 className="text-3xl font-extrabold mb-1">Challenge Complete!</h2>
          <p className="text-neutral-400 mb-8">Calculated {totalCorrect}/{history.length} correct in {(TOTAL_TIME - timeLeft)}s</p>

          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />
            <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Final Velocity Score</h3>
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-4">
              {velocityScore}
            </div>
            <div className="text-sm font-medium text-purple-400 bg-purple-500/10 py-2 px-6 rounded-full inline-block border border-purple-500/20">
              City Rank: #{currentUser?.city_rank || "---"}
            </div>
          </div>

          {topStruggle && (
            <div className="text-sm text-neutral-400 mb-8 px-4 leading-relaxed text-left bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
               <span className="text-fuchsia-400 font-bold block mb-1">Growth Opportunity:</span>
               You took {Math.round(topStruggle.timeTaken)} seconds on <span className="text-white font-mono">{topStruggle.prompt}</span>. 
               A MindSutra scholar solves this in {topStruggle.ideal}s using the <span className="font-bold text-white underline decoration-purple-500">{topStruggle.sutra}</span> technique.
            </div>
          )}

          <div className="space-y-3">
            <button onClick={() => router.push(topStruggle ? "/mindsutra/course/level-3" : "/mindsutra/course")} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 group">
              Level Up My Velocity <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            
            <button onClick={shareOnWhatsApp} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.429-9.877 9.888-9.877 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.431 9.878-9.89 9.878m11.734-19.13A12.145 12.145 0 0012.04 2 12.093 12.093 0 00.12 14.12a12.032 12.032 0 001.597 6.002L0 25l4.994-1.312a12.022 12.022 0 005.817 1.498h.005c6.645 0 12.05-5.405 12.05-12.05 0-3.219-1.253-6.244-3.528-8.517z"/></svg>
              Share Achievement
            </button>

            <button onClick={() => router.push("/mindsutra/challenge")} className="w-full bg-neutral-800/50 hover:bg-neutral-800 text-neutral-400 hover:text-white font-medium py-3 rounded-xl transition-all active:scale-95 text-sm uppercase tracking-wider">
              Return to Dashboard
            </button>
          </div>

          <div className="mt-8">
            <MindSutraBrandFooter
              note="Mindsutra by RoboDynamics"
              links={[
                { label: "Home", href: "/mindsutra" },
                { label: "Register", href: "/auth/register?source=mindsutra" },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qIndex];
  const progressPct = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col pt-10 px-6 pb-6 relative overflow-hidden font-sans">
      <div className="absolute top-4 left-6 right-6 z-10">
        <MindSutraBrandHeader
          eyebrow="RoboDynamics"
          title="MindSutra Challenge"
          subtitle="Speed round in progress"
          compact
        />
      </div>
      
      {/* Top HUD */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between mb-8 z-10">
        <div className="bg-neutral-900 border border-neutral-800 px-6 py-2 rounded-xl">
          <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest mr-3">Score</span>
          <span className="text-xl font-bold text-purple-400">{velocityScore}</span>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 px-6 py-2 rounded-xl text-center">
          <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest mr-3">Time</span>
          <span className={`text-xl font-bold ${timeLeft < 60 ? "text-red-500" : "text-fuchsia-400"}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-xl w-full mx-auto bg-neutral-900 h-2 rounded-full overflow-hidden mb-12 z-10">
        <div 
          className="h-full bg-gradient-to-r from-pruple-500 to-fuchsia-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPct}%`, backgroundColor: '#c026d3' }} 
        />
      </div>

      {/* Main Game Area */}
      <div className="max-w-2xl w-full mx-auto flex flex-col items-center flex-1 z-10">
        <h3 className="text-sm text-neutral-500 font-medium tracking-wide mb-8 uppercase">
          Question {qIndex + 1} of {questions.length}
        </h3>
        
        {/* Dynamic Question Render */}
        <div className="text-6xl md:text-8xl font-black mb-12 tracking-tighter" style={{ textShadow: "0 0 40px rgba(192, 38, 211, 0.4)" }}>
          {q.prompt}
        </div>

        {/* Input Field (Hidden on mobile if using numpad, but active for desktop) */}
        <div className="relative mb-8 w-64">
           {feedback && (
             <div className={`absolute -inset-2 rounded-2xl blur-lg transition-all ${feedback === "CORRECT" ? "bg-green-500/50" : "bg-red-500/50"}`} />
           )}
           <input
            ref={inputRef}
            type="number"
            disabled={!!feedback}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full relative z-10 text-center text-4xl font-bold bg-neutral-900 border-2 rounded-2xl py-4 focus:outline-none transition-all
              ${feedback === "CORRECT" ? "border-green-500 text-green-400" : 
                feedback === "INCORRECT" ? "border-red-500 text-red-400" : "border-neutral-800 focus:border-purple-500"}`}
            placeholder="?"
            autoFocus
          />
        </div>

        {/* Custom Numpad for Touch / Fast Input */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-auto pb-4">
          {[1,2,3,4,5,6,7,8,9,"DEL",0,"ENT"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleNumpad(btn.toString())}
              disabled={!!feedback}
              className={`py-4 md:py-6 text-2xl font-bold rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50
                ${btn === "ENT" ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white" : 
                  btn === "DEL" ? "bg-neutral-800 text-red-400" : "bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800"}`}
            >
              {btn === "ENT" ? "↲" : btn}
            </button>
          ))}
        </div>

        <div className="w-full mt-8">
          <MindSutraBrandFooter
            note="Mindsutra by RoboDynamics"
            links={[
              { label: "Dashboard", href: "/mindsutra/challenge" },
              { label: "Tutor", href: "/mindsutra/tutor" },
              { label: "Leaderboard", href: "/mindsutra/challenge/leaderboard" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
