"use client";

import React, { useState, useEffect, useRef } from "react";
import type { VidyaLessonPayload, VidyaLessonStep } from "../../lib/vidyaLessonTypes";
import { usePyodide } from "../../hooks/usePyodide";

interface VidyaLessonEngineProps {
  payload: VidyaLessonPayload;
  onComplete: (score: number) => void;
}

export default function VidyaLessonEngine({ payload, onComplete }: VidyaLessonEngineProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { pyodide, executeCode, checkAST, isLoading } = usePyodide();

  const step = payload.steps[currentStepIdx];
  const isLastStep = currentStepIdx === payload.steps.length - 1;

  // ─── VOICE TTS INTEGRATION ───
  useEffect(() => {
    if (!audioRef.current || !step.tutorText) return;
    
    // Auto-play the tutor's voice when the step changes
    const encodedText = encodeURIComponent(step.tutorText);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=en&client=tw-ob`;
    
    audioRef.current.src = url;
    audioRef.current.play().catch((err) => {
      console.log("Auto-play blocked until user interaction:", err);
    });
  }, [currentStepIdx, step.tutorText]);

  const handleNext = () => {
    setFeedback(null);
    setUserInput("");
    setIsSpeaking(false);
    if (audioRef.current) audioRef.current.pause();

    if (isLastStep) {
      onComplete(100);
    } else {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const checkAnswer = async () => {
    if (!step.practice || !step.practice.answer) return;
    
    // ─── NEW EXECUTION LOGIC FOR PYTHON SANDBOX ───
    if (step.practice.mode === "bug_hunt" || step.practice.mode === "code_snippet") {
      setFeedback("⏳ Running your code in the Sandbox...");
      
      // 1. AST Validation (Did they use the right concepts?)
      if (step.practice.requiredAstNodes && step.practice.requiredAstNodes.length > 0) {
        const astResult = await checkAST(userInput, step.practice.requiredAstNodes);
        
        if (astResult.error) {
          setFeedback(`❌ Syntax Error:\n${astResult.error}`);
          return;
        }
        
        if (!astResult.valid) {
          setFeedback(`❌ Your logic might work, but you didn't use the required concept. \nMissing: ${astResult.missing.join(", ")}`);
          return;
        }
      }

      // 2. Output Validation (Does the logic actually work?)
      const mockInputs = ["90", "Alex", "100", "Yes"];
      const solutionRes = await executeCode(step.practice.answer, mockInputs);
      const studentRes = await executeCode(userInput, mockInputs);
      
      if (studentRes.error) {
        setFeedback("❌ Python Error:\n" + studentRes.error);
        return;
      }
      
      if (studentRes.stdout.trim() === solutionRes.stdout.trim()) {
        setFeedback("✅ Excellent! Your output perfectly matches the expected logic.");
        setTimeout(() => handleNext(), 2500);
      } else {
        setFeedback(`❌ Logic Error.\n\nExpected Output:\n${solutionRes.stdout}\nYour Output:\n${studentRes.stdout || "[No Output]"}`);
      }
      return;
    }

    // ─── STANDARD KEYWORD MATCHING FOR OTHERS ───
    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedAnswer = step.practice.answer.trim().toLowerCase();

    // For interview questions, check if all keywords from answer exist in input
    if (step.practice.mode === "interview_question") {
      const keywords = step.practice.answer.split(",").map(k => k.trim().toLowerCase());
      const hasAllKeywords = keywords.every(k => normalizedInput.includes(k));
      if (hasAllKeywords) {
        setFeedback("✅ Excellent! You hit all the key concepts.");
        setTimeout(() => handleNext(), 1500);
      } else {
        setFeedback("❌ Missing key concepts. " + (step.practice.hints?.[0] || "Try again!"));
      }
      return;
    }

    if (normalizedInput === normalizedAnswer || normalizedInput.includes(normalizedAnswer)) {
      setFeedback("✅ Excellent! That is correct.");
      setTimeout(() => handleNext(), 1500);
    } else {
      setFeedback("❌ Not quite. " + (step.practice.hints?.[0] || "Try again!"));
    }
  };

  // ─── BOARD RENDERERS ────────────────────────────────────────────────────────

  const renderIntroCard = () => (
    <div className="bg-blue-900/40 p-8 rounded-xl border border-blue-500/30 text-center">
      <div className="text-6xl mb-4">{step.board.data?.emoji}</div>
      <h2 className="text-3xl font-bold text-white mb-2">{step.board.data?.headline}</h2>
      <div className="text-blue-200 mb-6 font-mono bg-blue-950 p-3 rounded-lg inline-block">
        {step.board.data?.example}
      </div>
      <p className="text-lg text-blue-100 italic">Goal: {step.board.data?.goal}</p>
    </div>
  );

  const renderConceptCard = () => (
    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">{step.board.data?.emoji}</span>
        <h2 className="text-2xl font-bold text-white">{step.board.data?.title}</h2>
      </div>
      <ul className="space-y-4 mb-8">
        {step.board.data?.points?.map((pt: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-slate-300">
            <span className="text-green-400 mt-1">✓</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
      {step.explanation && (
        <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-indigo-500">
          <h4 className="font-bold text-indigo-400 mb-1">{step.explanation.title}</h4>
          <p className="text-sm text-slate-400">{step.explanation.body}</p>
        </div>
      )}
    </div>
  );

  const renderCodeWalkthrough = () => (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 font-mono">
      <h3 className="text-slate-400 text-sm mb-4 border-b border-slate-800 pb-2">
        {step.board.data?.expression}
      </h3>
      <div className="space-y-2 mb-6">
        {step.board.data?.steps?.map((line: string, i: number) => (
          <div key={i} className="flex gap-4 items-start text-sm">
            <span className="text-slate-600 select-none">{i + 1}</span>
            <code className="text-green-400 whitespace-pre-wrap">{line}</code>
          </div>
        ))}
      </div>
      <div className="bg-black/50 p-4 rounded text-slate-300 text-sm border-l-2 border-green-500">
        &gt; {step.board.data?.result}
      </div>
    </div>
  );

  const renderInteractiveBoard = () => (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">
        {step.board.data?.headline || step.board.data?.title}
      </h3>
      
      {step.practice?.mode === "output_prediction" && (
        <div className="mb-6 p-4 bg-black rounded-lg border border-slate-800">
          <pre className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
            {step.board.data?.prompt}
          </pre>
        </div>
      )}

      {(step.practice?.mode === "bug_hunt" || step.practice?.mode === "code_snippet") && (
        <div className="mb-6">
          <textarea
            className="w-full h-48 bg-slate-950 text-green-400 font-mono p-4 rounded-lg border border-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            value={userInput || step.practice?.starterCode || ""}
            onChange={(e) => setUserInput(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}

      {step.practice?.mode === "interview_question" && (
        <div className="mb-6">
          <p className="text-slate-300 mb-3">{step.practice.prompt}</p>
          <textarea
            className="w-full h-32 bg-slate-800 text-white p-4 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            placeholder="Type your explanation here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </div>
      )}

      {(step.practice?.mode === "multiple_choice" || step.practice?.mode === "output_prediction") && (
        <div className="mb-6">
          <p className="text-slate-300 mb-3">{step.practice.prompt}</p>
          <input
            type="text"
            className="w-full bg-slate-800 text-white p-3 rounded border border-slate-700 focus:border-indigo-500 focus:outline-none"
            placeholder="Type your answer here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          />
        </div>
      )}

      {feedback && (
        <div className={`p-3 rounded mb-4 text-sm font-medium ${feedback.includes("✅") ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
          {feedback}
        </div>
      )}

      {step.practice && !feedback?.includes("✅") && (
        <button 
          onClick={checkAnswer}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded transition-colors"
        >
          Submit Code
        </button>
      )}
    </div>
  );

  const renderRecapSummary = () => (
    <div className="bg-emerald-900/30 p-8 rounded-xl border border-emerald-500/30 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">{step.board.data?.title}</h2>
      
      <div className="bg-emerald-950/50 rounded-lg p-6 mb-6 inline-block text-left border border-emerald-800/50">
        <ul className="space-y-3">
          {step.board.data?.keyPoints?.map((pt: string, i: number) => (
            <li key={i} className="flex gap-3 text-emerald-100">
              <span className="text-emerald-500">✦</span>
              {pt}
            </li>
          ))}
        </ul>
      </div>

      {step.board.data?.badgeAwarded && (
        <div className="mt-4 pt-6 border-t border-emerald-800/50">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-2">Badge Unlocked</p>
          <div className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-2 px-6 rounded-full shadow-lg shadow-yellow-500/20">
            {step.board.data.badgeAwarded}
          </div>
        </div>
      )}
    </div>
  );

  // ─── MAIN RENDER ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      
      {/* LEFT COLUMN: AI TUTOR AVATAR & TEXT */}
      <div className="w-full md:w-1/3 p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            {payload.course.title} • {payload.lesson.title}
          </h1>
          <div className="flex gap-2 mb-8">
            {payload.steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full ${i <= currentStepIdx ? "bg-indigo-500" : "bg-slate-800"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 border-2 border-slate-900 shadow-xl shadow-indigo-500/20 z-10 relative transition-transform ${isSpeaking ? 'scale-110' : ''}`}>
                <span className="font-bold text-white text-lg">VA</span>
              </div>
              {/* Pulsing ring when speaking */}
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75 z-0" style={{ animationDuration: '1.5s' }} />
              )}
            </div>
            
            <div className="bg-slate-800 p-5 rounded-2xl rounded-tl-none border border-slate-700 shadow-lg relative group cursor-pointer" onClick={() => audioRef.current?.play()}>
              <p className="text-lg leading-relaxed text-slate-200">
                {step.tutorText}
              </p>
              
              {/* Hidden audio element */}
              <audio 
                ref={audioRef} 
                onPlay={() => setIsSpeaking(true)}
                onEnded={() => setIsSpeaking(false)}
                onPause={() => setIsSpeaking(false)}
                className="hidden" 
              />
              
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a8 8 0 010 11.314M10.5 19.5L6 15H3a2 2 0 01-2-2V11a2 2 0 012-2h3l4.5-4.5v15z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE BOARD */}
      <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-2xl">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">
            {step.label}
          </h2>
          
          <div className="mb-8 transition-all duration-500 ease-in-out">
            {step.board.type === "intro_card" && renderIntroCard()}
            {step.board.type === "concept_card" && renderConceptCard()}
            {step.board.type === "code_walkthrough" && renderCodeWalkthrough()}
            {step.board.type === "recap_summary" && renderRecapSummary()}
            {(step.board.type === "practice_board" || step.board.type === "python_repl_simulator") && renderInteractiveBoard()}
          </div>

          {!step.practice && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
              >
                {step.actions[0]?.label || "Continue"}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
