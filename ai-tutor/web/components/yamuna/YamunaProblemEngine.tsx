"use client";

/**
 * YamunaProblemEngine — full 5-stage adaptive Java coding challenge UI
 * UNDERSTAND → DESIGN → CODE → TEST → REFLECT
 *
 * - Java execution via Piston API through /api/yamuna/execute
 * - Progressive hint reveal (one at a time, max 5)
 * - Reference program revealed after 3 failed attempts
 * - Score-based adaptive routing via computeProgramScore + adaptiveDecision
 * - XP award animation on REFLECT stage
 * - Amber/orange Java branding (☕)
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useJavaExecutor } from "../../hooks/useJavaExecutor";
import type { YamunaProgram } from "../../lib/yamunaProgramTypes";
import {
  TIER_META,
  computeProgramScore,
  adaptiveDecision,
} from "../../lib/yamunaProgramTypes";

// ─── Semantic output comparison ───────────────────────────────────────────────
function normalizeToken(s: string): string {
  return s
    .toLowerCase()
    .replace(/(?<!\d)[.,;:!?'"()\[\]{}\-_\/\\|@#$%^&*+=<>~`](?!\d)/g, "")
    .replace(/[.,;:!?'"()\[\]{}\-_\/\\|@#$%^&*+=<>~`]/g, (m, offset, str) => {
      const before = str[offset - 1];
      const after  = str[offset + 1];
      if (m === "." && before >= "0" && before <= "9" && after >= "0" && after <= "9") return m;
      return " ";
    })
    .replace(/\s+/g, " ")
    .trim();
}
function wordsOf(s: string): string[] {
  return s.split(/\s+/).filter(Boolean).sort();
}
function outputsMatch(got: string, expected: string): boolean {
  const gLines = got.trimEnd().split("\n");
  const eLines = expected.trimEnd().split("\n");
  if (gLines.length !== eLines.length) return false;
  return gLines.every((gLine, i) => {
    const g = gLine.trimEnd(), e = eLines[i].trimEnd();
    if (g === e) return true;
    const gN = normalizeToken(g), eN = normalizeToken(e);
    if (gN === eN) return true;
    return wordsOf(gN).join("|") === wordsOf(eN).join("|");
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage = "understand" | "design" | "code" | "test" | "reflect";
interface TestResult {
  id: string; label: string; passed: boolean;
  expected: string; got: string; isBoundary: boolean; error?: string;
}
interface Props {
  program: YamunaProgram;
  onComplete: (p: {
    programId: string; score: number;
    decision: "next_tier" | "next_program" | "show_reference";
    xpEarned: number; hintsUsed: number; failedAttempts: number;
    testCasesPassed: number; totalTestCases: number; secondsElapsed: number;
  }) => void;
  onExit?: () => void;
}

// ─── Stage bar ────────────────────────────────────────────────────────────────
const STAGES: Stage[] = ["understand","design","code","test","reflect"];
const STAGE_ICONS: Record<Stage,string> = { understand:"📖", design:"✏️", code:"💻", test:"🧪", reflect:"🌟" };
const STAGE_LABELS: Record<Stage,string> = { understand:"Understand", design:"Design", code:"Code", test:"Test", reflect:"Reflect" };

function StageBar({ current }: { current: Stage }) {
  const ci = STAGES.indexOf(current);
  return (
    <div className="flex items-center gap-0 w-full mb-6 select-none">
      {STAGES.map((s, i) => {
        const done = i < ci, active = i === ci;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all ${active ? "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-500/30" : done ? "bg-green-600 border-green-400 text-white" : "bg-slate-800 border-slate-700 text-slate-500"}`}>
                {done ? "✓" : STAGE_ICONS[s]}
              </div>
              <span className={`hidden sm:block text-[10px] mt-1 font-semibold uppercase tracking-wide ${active ? "text-amber-400" : done ? "text-green-400" : "text-slate-600"}`}>{STAGE_LABELS[s]}</span>
            </div>
            {i < STAGES.length - 1 && <div className={`flex-1 h-0.5 mb-5 transition-colors ${i < ci ? "bg-green-500" : "bg-slate-700"}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Tier badge ───────────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: YamunaProgram["tier"] }) {
  const m = TIER_META[tier];
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border" style={{ color: m.color, borderColor: m.color+"55", background: m.color+"18" }}>
      {m.emoji} {m.label}
    </span>
  );
}

// ─── Java editor ─────────────────────────────────────────────────────────────
function JavaEditor({ value, onChange, readOnly=false, heightClass="h-72" }: {
  value:string; onChange:(v:string)=>void; readOnly?:boolean; heightClass?:string;
}) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const lines = value.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(()=>{setCopied(true); setTimeout(()=>setCopied(false),2000);}).catch(()=>{
      const t=taRef.current; if(t){t.select(); document.execCommand("copy");} setCopied(true); setTimeout(()=>setCopied(false),2000);
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(readOnly || e.key !== "Tab") return;
    e.preventDefault();
    const ta=e.currentTarget, s=ta.selectionStart, end=ta.selectionEnd;
    const nv=value.substring(0,s)+"    "+value.substring(end);
    onChange(nv); setTimeout(()=>{ta.selectionStart=ta.selectionEnd=s+4;},0);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl flex flex-col font-mono text-sm">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between select-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"/><div className="w-3 h-3 rounded-full bg-[#ffbd2e]"/><div className="w-3 h-3 rounded-full bg-[#27c93f]"/>
        </div>
        <span className="text-xs text-slate-400 font-semibold">☕ Main.java</span>
        <div className="flex items-center gap-3">
          <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 px-2 py-0.5 rounded" style={{ color: copied?"#4ade80":"#64748b", background: copied?"#052e1680":"transparent", border: copied?"1px solid #16a34a40":"1px solid transparent" }}>
            {copied ? <><span>✓</span><span>Copied!</span></> : <><span>⎘</span><span>Copy</span></>}
          </button>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"/>Java 17
          </span>
        </div>
      </div>
      <div className={`flex bg-slate-950 ${heightClass} relative`}>
        <div ref={gutterRef} className="w-11 select-none text-slate-600 text-right pr-3 py-4 border-r border-slate-900 overflow-hidden leading-6 font-mono text-xs bg-slate-900/40">
          {lines.map((_,i)=><div key={i} className="h-6">{i+1}</div>)}
        </div>
        <textarea ref={taRef} className={`flex-1 bg-transparent text-amber-300 p-4 pl-3 focus:outline-none resize-none h-full font-mono text-sm leading-6 overflow-y-auto selection:bg-amber-500/30 selection:text-white ${readOnly?"cursor-default opacity-80":""}`}
          value={value} onChange={readOnly?undefined:(e)=>onChange(e.target.value)} onKeyDown={handleKeyDown}
          onScroll={()=>{ if(taRef.current&&gutterRef.current) gutterRef.current.scrollTop=taRef.current.scrollTop; }}
          readOnly={readOnly} spellCheck={false}/>
      </div>
    </div>
  );
}

// ─── Reference panel ─────────────────────────────────────────────────────────
function ReferencePanel({ refProg }: { refProg: NonNullable<YamunaProgram["referenceProgram"]> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border border-amber-600/40 rounded-xl overflow-hidden">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-amber-900/20 hover:bg-amber-900/30 transition-colors text-left">
        <span className="flex items-center gap-2 text-sm font-semibold text-amber-400">💡 Reference: {refProg.title}</span>
        <span className="text-amber-500 text-xs">{open?"▲ hide":"▼ show"}</span>
      </button>
      {open && <div className="px-4 pb-4 bg-amber-900/10"><p className="text-xs text-amber-300/70 mb-2 mt-1">{refProg.description}</p><JavaEditor value={refProg.code} onChange={()=>{}} readOnly heightClass="h-56"/></div>}
    </div>
  );
}

// ─── Test result row ──────────────────────────────────────────────────────────
function TestResultRow({ result }: { result: TestResult }) {
  const [show, setShow] = useState(false);
  return (
    <div className={`rounded-lg border p-3 ${result.passed ? "border-green-700/40 bg-green-900/10" : "border-red-700/40 bg-red-900/10"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{result.passed?"✅":"❌"}</span>
          <span className="text-sm font-medium text-slate-200">{result.label}</span>
          {result.isBoundary && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-600/30 font-bold">⚠ boundary</span>}
        </div>
        {!result.passed && <button onClick={()=>setShow(!show)} className="text-xs text-slate-400 hover:text-slate-200">{show?"▲ less":"▼ details"}</button>}
      </div>
      {!result.passed && show && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div><div className="text-slate-500 mb-1">Expected:</div><pre className="bg-green-900/20 border border-green-700/30 rounded p-2 text-green-300 whitespace-pre-wrap break-words">{result.expected}</pre></div>
          <div><div className="text-slate-500 mb-1">Got:</div><pre className={`rounded p-2 whitespace-pre-wrap break-words border ${result.error?"bg-red-900/30 border-red-700/30 text-red-300":"bg-slate-900 border-slate-700 text-slate-300"}`}>{result.error?`🚨 ${result.error}`:result.got||"(empty)"}</pre></div>
        </div>
      )}
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const pct = Math.round(score*100), r=36, circ=2*Math.PI*r;
  const color = pct>=80?"#22c55e":pct>=40?"#eab308":"#ef4444";
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1e293b" strokeWidth="8"/>
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.8s ease"}}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-black text-white">{pct}%</span><span className="text-[10px] text-slate-400 font-semibold">score</span></div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function YamunaProblemEngine({ program, onComplete, onExit }: Props) {
  const { execute, isLoading: javaLoading } = useJavaExecutor();

  const [stage, setStage] = useState<Stage>("understand");
  const [code, setCode] = useState(program.starterCode);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [runtimeError, setRuntimeError] = useState<string|null>(null);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [xpAnimating, setXpAnimating] = useState(false);
  const [decision, setDecision] = useState<"next_tier"|"next_program"|"show_reference">("next_program");
  const [quickRunOutput, setQuickRunOutput] = useState<{stdout:string;error?:string}|null>(null);
  const [quickRunning, setQuickRunning] = useState(false);
  const [userStdin, setUserStdin] = useState("");

  useEffect(()=>{
    setStage("understand"); setCode(program.starterCode); setHintsRevealed(0); setFailedAttempts(0);
    setRunning(false); setTestResults([]); setRuntimeError(null); setScore(0); setSecondsElapsed(0);
    setQuickRunOutput(null); setXpEarned(0); setXpAnimating(false); setUserStdin("");
  },[program.id, program.starterCode]);

  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  useEffect(()=>{
    if(stage==="code"){ setStartTime(Date.now()); timerRef.current=setInterval(()=>setSecondsElapsed(Math.floor((Date.now()-startTime)/1000)),1000); }
    else { if(timerRef.current) clearInterval(timerRef.current); }
    return ()=>{ if(timerRef.current) clearInterval(timerRef.current); };
  },[stage]); // eslint-disable-line

  const handleQuickRun = useCallback(async()=>{
    setQuickRunning(true); setQuickRunOutput(null);
    const stdinLines = userStdin.trim() ? userStdin.split("\n").map(l=>l.trimEnd()) : [];
    const result = await execute(code, stdinLines);
    setQuickRunOutput(result); setQuickRunning(false);
  },[code, userStdin, execute]);

  const handleRunTests = useCallback(async()=>{
    setRunning(true); setRuntimeError(null);
    const visible = program.testCases.filter(tc=>!tc.isHidden);
    const results: TestResult[] = [];
    for(const tc of visible){
      const {stdout, error} = await execute(code, tc.mockInputs);
      const got=stdout.trimEnd(), expected=tc.expectedOutput.trimEnd();
      results.push({ id:tc.id, label:tc.label, passed:!error&&outputsMatch(got,expected), expected, got, isBoundary:tc.isBoundary??false, error });
    }
    setTestResults(results);
    const passed=results.filter(r=>r.passed).length, total=results.length;
    const boundaryPassed=results.filter(r=>r.isBoundary).every(r=>r.passed);
    const solved=passed===total;
    if(!solved){ setFailedAttempts(f=>f+1); if(passed===0){ const e=results.find(r=>r.error)?.error; if(e) setRuntimeError(e); } }
    const elapsed=Math.floor((Date.now()-startTime)/1000);
    const s=computeProgramScore({ programId:program.id, solved, hintsUsed:hintsRevealed, failedAttempts:solved?failedAttempts:failedAttempts+1, secondsElapsed:elapsed, testCasesPassed:passed, totalTestCases:total, boundaryPassed });
    const dec=adaptiveDecision(s);
    const xp=solved?Math.round(program.xpReward*s):0;
    setScore(s); setDecision(dec); setXpEarned(xp); setRunning(false); setStage("test");
    if(xp>0) setTimeout(()=>setXpAnimating(true),400);
  },[code, program, execute, hintsRevealed, failedAttempts, startTime]);

  // ── UNDERSTAND ────────────────────────────────────────────────────────────
  const renderUnderstand = () => (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="text-5xl select-none">{program.emoji}</div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap"><TierBadge tier={program.tier}/><span className="text-xs text-slate-500">Ch.{program.chapterNumber} · ~{program.estimatedMinutes} min · {program.xpReward} XP</span></div>
          <h2 className="text-xl font-black text-white">{program.title}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{program.tagline}</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Problem</h3>
        <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-sans">{program.problemStatement}</pre>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4"><h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Input</h4><p className="text-sm text-slate-300">{program.inputFormat}</p></div>
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4"><h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Output</h4><p className="text-sm text-slate-300">{program.outputFormat}</p></div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Examples</h3>
        <div className="space-y-3">
          {program.examples.map((ex,i)=>(
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div><div className="text-slate-500 mb-1 font-sans">Input {i+1}</div><pre className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-blue-300 whitespace-pre-wrap">{ex.input}</pre></div>
              <div><div className="text-slate-500 mb-1 font-sans">Output {i+1}</div><pre className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-green-300 whitespace-pre-wrap">{ex.output}</pre></div>
              {ex.explanation && <p className="col-span-2 text-slate-400 font-sans text-xs">💬 {ex.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
      {program.constraints.length>0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Constraints</h3>
          <ul className="space-y-1">{program.constraints.map((c,i)=><li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-amber-400 mt-0.5">▸</span> {c}</li>)}</ul>
        </div>
      )}
      <div className="flex flex-wrap gap-2">{program.concepts.map(c=><span key={c} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-medium">{c}</span>)}</div>
      <button onClick={()=>setStage("design")} className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-base transition-all shadow-lg shadow-amber-900/40 active:scale-95">I understand the problem → Design</button>
    </div>
  );

  // ── DESIGN ────────────────────────────────────────────────────────────────
  const renderDesign = () => (
    <div className="space-y-5">
      <div><h2 className="text-lg font-black text-white">{program.emoji} {program.title}</h2><p className="text-sm text-slate-400">Think through your approach before writing Java code.</p></div>
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">💡 Hints — {hintsRevealed}/{program.hints.length} revealed</h3>
          <span className="text-xs text-slate-600">{hintsRevealed>0?`-${hintsRevealed*12}% score`:"free tier"}</span>
        </div>
        <div className="space-y-3">
          {program.hints.slice(0,hintsRevealed).map((hint,i)=>(
            <div key={i} className="flex gap-3 text-sm text-slate-300 bg-amber-900/20 border border-amber-700/30 rounded-lg px-3 py-2.5">
              <span className="text-amber-400 font-bold shrink-0">{i+1}.</span><span>{hint}</span>
            </div>
          ))}
          {hintsRevealed<program.hints.length && <button onClick={()=>setHintsRevealed(h=>h+1)} className="w-full py-2.5 rounded-lg border border-dashed border-amber-700/50 text-amber-400 text-sm font-semibold hover:bg-amber-900/20 transition-colors">Show hint {hintsRevealed+1} of {program.hints.length}</button>}
          {hintsRevealed===program.hints.length && <p className="text-xs text-slate-600 text-center">All hints revealed</p>}
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Java concepts to use</h3>
        <div className="flex flex-wrap gap-2">{program.concepts.map(c=><span key={c} className="text-xs px-2.5 py-1 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300 font-medium">{c}</span>)}</div>
      </div>
      {program.timeComplexityTarget && <div className="text-xs text-slate-500 border border-slate-800 rounded-lg px-3 py-2">🎯 Target complexity: <span className="text-yellow-400 font-mono">{program.timeComplexityTarget}</span></div>}
      <button onClick={()=>setStage("code")} className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-base transition-all shadow-lg shadow-amber-900/40 active:scale-95">Start Coding →</button>
    </div>
  );

  // ── CODE ──────────────────────────────────────────────────────────────────
  const renderCode = () => {
    const showRef = failedAttempts>=3 && program.referenceProgram;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">{program.emoji} {program.title}</h2>
            <p className="text-xs text-slate-500">Attempt {failedAttempts+1} · {hintsRevealed} hint{hintsRevealed!==1?"s":""} used{failedAttempts>0&&<> · <span className="text-red-400">{failedAttempts} failed</span></>}</p>
          </div>
          <div className={`flex items-center gap-1.5 text-xs ${javaLoading?"text-yellow-400":"text-green-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${javaLoading?"bg-yellow-400 animate-pulse":"bg-green-400"}`}/>{javaLoading?"Compiling…":"Ready"}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <JavaEditor value={code} onChange={setCode} heightClass="h-72 sm:h-80 lg:h-[28rem]"/>
            <div className="rounded-lg border border-blue-900/40 bg-slate-900 overflow-hidden">
              <div className="bg-slate-800/50 px-3 py-1.5 border-b border-slate-800 flex items-center gap-2 select-none">
                <span className="text-blue-400 text-xs">📥</span><span className="text-xs font-bold text-slate-300">stdin — Scanner input</span><span className="text-[10px] text-slate-600 ml-auto">one value per line</span>
              </div>
              <textarea value={userStdin} onChange={e=>setUserStdin(e.target.value)} placeholder={"5\nAlice\n100"} className="w-full bg-transparent text-blue-300 font-mono text-xs p-3 resize-none focus:outline-none leading-5 placeholder:text-slate-700" rows={3} spellCheck={false} autoCapitalize="none" autoCorrect="off"/>
            </div>
            <button onClick={handleQuickRun} disabled={quickRunning} className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${quickRunning?"bg-slate-700 text-slate-500 cursor-not-allowed":"bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-900/30"}`}>
              {quickRunning ? <><span style={{display:"inline-block",width:14,height:14,border:"2px solid #78716c",borderTopColor:"#f59e0b",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/><span>Compiling…</span></> : <><span>▶</span><span>Run</span></>}
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col font-mono text-sm" style={{minHeight:"18rem"}}>
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between select-none flex-shrink-0">
              <span className="text-xs text-slate-400 font-semibold">⬛ Output</span>
              <div className="flex items-center gap-3">
                {userStdin.trim() ? <span className="text-[10px] text-slate-600 font-mono">stdin: <span className="text-blue-400">{userStdin.split("\n").filter(Boolean).join(", ")}</span></span> : <span className="text-[10px] text-slate-700 font-mono italic">no stdin</span>}
                {quickRunOutput && <button onClick={()=>setQuickRunOutput(null)} className="text-[10px] text-slate-600 hover:text-slate-400 font-semibold">Clear</button>}
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {!quickRunOutput && !quickRunning && <div className="flex flex-col items-center justify-center h-full text-center gap-3 select-none"><span className="text-3xl opacity-30">▶</span><p className="text-slate-600 text-xs leading-relaxed">Click <span className="text-amber-400 font-bold">▶ Run</span> to compile and run.<br/>Fix errors here before running tests.</p></div>}
              {quickRunning && <div className="flex items-center gap-2 text-slate-500 text-xs"><span style={{display:"inline-block",width:12,height:12,border:"2px solid #475569",borderTopColor:"#f59e0b",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Compiling and running…</div>}
              {quickRunOutput && !quickRunning && (quickRunOutput.error ? <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">{"COMPILE/RUNTIME ERROR!\n"+quickRunOutput.error+"\n\n=== Java Exited With Errors ==="}</pre> : <div><pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">{quickRunOutput.stdout||"(no output — did you forget System.out.println()?)"}</pre><p className="text-slate-600 text-[10px] mt-3 border-t border-slate-800 pt-2">=== Program Exited Successfully ===</p></div>)}
            </div>
          </div>
        </div>
        {runtimeError && <div className="rounded-lg border border-red-700/40 bg-red-900/20 px-4 py-3 text-xs font-mono text-red-300 whitespace-pre-wrap">🚨 {runtimeError}</div>}
        {showRef && <ReferencePanel refProg={program.referenceProgram!}/>}
        <div className="flex gap-3">
          <button onClick={()=>setStage("design")} className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors">← Hints</button>
          <button onClick={handleRunTests} disabled={running} className={`flex-1 py-3 rounded-xl font-bold text-base transition-all active:scale-95 ${running?"bg-slate-700 text-slate-500 cursor-not-allowed":"bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40"}`}>
            {running?"⏳ Compiling & testing…":"▶ Run Tests"}
          </button>
        </div>
      </div>
    );
  };

  // ── TEST ──────────────────────────────────────────────────────────────────
  const renderTest = () => {
    const passed=testResults.filter(r=>r.passed).length, total=testResults.length, allPassed=passed===total;
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-xl border border-slate-700 bg-slate-900">
          <ScoreRing score={score}/>
          <div className="flex-1">
            <div className="text-2xl font-black text-white mb-1">{passed}/{total} tests passed</div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full font-semibold ${allPassed?"bg-green-500/20 text-green-400 border border-green-600/30":"bg-red-500/20 text-red-400 border border-red-600/30"}`}>{allPassed?"✅ All Passed":`❌ ${total-passed} failing`}</span>
              {hintsRevealed>0 && <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600/30">{hintsRevealed} hints used</span>}
              {failedAttempts>0 && <span className="px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 border border-red-700/30">{failedAttempts} failed attempt{failedAttempts!==1?"s":""}</span>}
            </div>
            <div className="mt-2 text-sm">
              {allPassed&&decision==="next_tier"&&<span className="text-green-400 font-semibold">🚀 Excellent! Ready for the next tier.</span>}
              {allPassed&&decision==="next_program"&&<span className="text-blue-400 font-semibold">👍 Good work! Moving to the next program.</span>}
              {!allPassed&&decision==="show_reference"&&<span className="text-amber-400 font-semibold">💡 Study the reference, then try again.</span>}
              {!allPassed&&decision!=="show_reference"&&<span className="text-slate-400">Fix the failing tests and resubmit.</span>}
            </div>
          </div>
        </div>
        <div className="space-y-2">{testResults.map(r=><TestResultRow key={r.id} result={r}/>)}</div>
        <div className="flex gap-3">
          {!allPassed && <button onClick={()=>{setStage("code");setRuntimeError(null);}} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-bold text-sm transition-colors">← Fix & Retry</button>}
          {allPassed && <button onClick={()=>setStage("reflect")} className="flex-1 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-base transition-all shadow-lg shadow-amber-900/40 active:scale-95">Collect XP → Reflect 🌟</button>}
          {!allPassed&&decision==="show_reference" && <button onClick={()=>onComplete({programId:program.id,score:0,decision,xpEarned:0,hintsUsed:hintsRevealed,failedAttempts,testCasesPassed:0,totalTestCases:program.testCases.filter(t=>!t.isHidden).length,secondsElapsed:Math.floor((Date.now()-startTime)/1000)})} className="flex-1 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-sm transition-colors">Skip → Next Program</button>}
        </div>
      </div>
    );
  };

  // ── REFLECT ───────────────────────────────────────────────────────────────
  const renderReflect = () => {
    const pct=Math.round(score*100);
    const scoreColor=pct>=80?"text-green-400":pct>=40?"text-yellow-400":"text-red-400";
    return (
      <div className="space-y-5 text-center">
        <div className="py-6"><div className="text-6xl mb-3">{pct>=80?"🏆":pct>=40?"🎯":"📘"}</div><h2 className="text-2xl font-black text-white">{program.title}</h2><p className="text-slate-400 text-sm mt-1">{program.tagline}</p></div>
        <div className={`rounded-2xl border p-6 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700/30 transition-all duration-700 ${xpAnimating?"scale-100 opacity-100":"scale-95 opacity-70"}`}>
          <div className={`text-5xl font-black ${xpAnimating?scoreColor:"text-slate-500"} transition-all duration-700`}>+{xpEarned} XP</div>
          <div className="text-slate-400 text-sm mt-1">of {program.xpReward} possible</div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Score Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300"><span>Base score</span><span className="font-mono">1.00</span></div>
            {hintsRevealed>0 && <div className="flex justify-between text-red-400"><span>Hints used ({hintsRevealed})</span><span className="font-mono">-{(hintsRevealed*0.12).toFixed(2)}</span></div>}
            {failedAttempts>0 && <div className="flex justify-between text-red-400"><span>Failed attempts ({failedAttempts})</span><span className="font-mono">-{(failedAttempts*0.08).toFixed(2)}</span></div>}
            {secondsElapsed<120 && <div className="flex justify-between text-green-400"><span>Speed bonus (&lt;2 min)</span><span className="font-mono">+0.05</span></div>}
            <div className={`flex justify-between font-bold border-t border-slate-700 pt-2 mt-2 ${scoreColor}`}><span>Final score</span><span className="font-mono">{score.toFixed(2)}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Concepts practised</h3>
          <div className="flex flex-wrap gap-2">{program.concepts.map(c=><span key={c} className="text-xs px-2.5 py-1 rounded-full bg-green-900/30 border border-green-700/40 text-green-300 font-medium">✓ {c}</span>)}</div>
        </div>
        {program.referenceProgram && (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">📖 Model Solution</h3>
            <p className="text-[11px] text-slate-500 mb-3">You earned this. Compare your Java code — there is always more than one right way.</p>
            <div className="rounded-lg overflow-hidden border border-slate-800">
              <div className="bg-slate-950 px-3 py-1.5 flex items-center gap-1.5 border-b border-slate-800 select-none"><span className="text-[10px] text-slate-500 font-mono">☕ reference/Main.java</span></div>
              <pre className="bg-slate-950 text-amber-300 text-xs font-mono p-4 whitespace-pre-wrap leading-relaxed overflow-x-auto">{program.referenceProgram.code}</pre>
            </div>
            {program.referenceProgram.explanation && <p className="text-xs text-slate-400 mt-3 leading-relaxed italic border-l-2 border-slate-700 pl-3">{program.referenceProgram.explanation}</p>}
          </div>
        )}
        {program.designChallenge && <div className="rounded-xl border border-purple-700/30 bg-purple-900/10 p-4 text-left"><h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">🏆 Design Challenge</h3><p className="text-sm text-purple-200">{program.designChallenge}</p></div>}
        <div className="pt-2">
          <div className="text-xs text-slate-500 mb-3 uppercase tracking-widest font-semibold">
            {decision==="next_tier"&&"Ready to advance tier →"}{decision==="next_program"&&"Next program in same tier →"}{decision==="show_reference"&&"Review reference, then continue →"}
          </div>
          <button onClick={()=>onComplete({programId:program.id,score,decision,xpEarned,hintsUsed:hintsRevealed,failedAttempts,testCasesPassed:testResults.filter(r=>r.passed).length,totalTestCases:testResults.length,secondsElapsed})}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-lg transition-all shadow-lg shadow-orange-900/50 active:scale-95">
            {decision==="next_tier"?"Advance to next tier ⬆":"Next Program →"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          {onExit ? <button onClick={onExit} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">← Back</button> : <div/>}
          <TierBadge tier={program.tier}/>
        </div>
        <StageBar current={stage}/>
        <div key={stage} className="animate-fadeIn">
          {stage==="understand"&&renderUnderstand()}
          {stage==="design"&&renderDesign()}
          {stage==="code"&&renderCode()}
          {stage==="test"&&renderTest()}
          {stage==="reflect"&&renderReflect()}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
