"use client";

/**
 * YamunaProblemEngine — LeetCode-style adaptive Java coding challenge UI
 *
 * Layout (md+):
 *   Left panel  (42%) — tabs: 📋 Problem | 💡 Hints | 🧪 Tests
 *   Right panel (58%) — Editor + stdin + ▶Run + Submit + Output
 *
 * Mobile (<md): left panel collapses to a drawer toggle.
 *
 * Java execution via Piston API through /api/yamuna/execute.
 * Amber/orange Java branding (☕).
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
      const before = str[offset - 1]; const after = str[offset + 1];
      if (m === "." && before >= "0" && before <= "9" && after >= "0" && after <= "9") return m;
      return " ";
    })
    .replace(/\s+/g, " ").trim();
}
function wordsOf(s: string): string[] { return s.split(/\s+/).filter(Boolean).sort(); }
function outputsMatch(got: string, expected: string): boolean {
  const gL = got.trimEnd().split("\n"), eL = expected.trimEnd().split("\n");
  if (gL.length !== eL.length) return false;
  return gL.every((g, i) => {
    const e = eL[i].trimEnd(), gT = g.trimEnd();
    if (gT === e) return true;
    const gN = normalizeToken(gT), eN = normalizeToken(e);
    if (gN === eN) return true;
    return wordsOf(gN).join("|") === wordsOf(eN).join("|");
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────
type LeftTab = "problem" | "hints" | "tests";
type Stage   = "coding" | "testing" | "passed";
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

// ─── Tier badge ───────────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: YamunaProgram["tier"] }) {
  const m = TIER_META[tier];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border"
      style={{ color: m.color, borderColor: m.color + "55", background: m.color + "18" }}>
      {m.emoji} {m.label}
    </span>
  );
}

// ─── Java editor ─────────────────────────────────────────────────────────────
function JavaEditor({ value, onChange, readOnly = false }: { value: string; onChange: (v: string) => void; readOnly?: boolean }) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const taRef     = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const lines = value.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => { const t = taRef.current; if (t) { t.select(); document.execCommand("copy"); } setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly || e.key !== "Tab") return;
    e.preventDefault();
    const ta = e.currentTarget, s = ta.selectionStart;
    const nv = value.substring(0, s) + "    " + value.substring(ta.selectionEnd);
    onChange(nv); setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-sm">
      {/* chrome bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between select-none flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-xs text-slate-400 font-semibold">☕ Main.java</span>
        <div className="flex items-center gap-3">
          <button onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all"
            style={{ color: copied ? "#4ade80" : "#64748b", background: copied ? "#052e1680" : "transparent", border: copied ? "1px solid #16a34a40" : "1px solid transparent" }}>
            {copied ? "✓ Copied!" : "⎘ Copy"}
          </button>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />Java 17
          </span>
        </div>
      </div>
      {/* body */}
      <div className="flex flex-1 min-h-0 bg-slate-950">
        <div ref={gutterRef}
          className="w-11 select-none text-slate-600 text-right pr-3 py-4 border-r border-slate-900 overflow-hidden leading-6 font-mono text-xs bg-slate-900/40 flex-shrink-0">
          {lines.map((_, i) => <div key={i} className="h-6">{i + 1}</div>)}
        </div>
        <textarea ref={taRef}
          className={`flex-1 bg-transparent text-amber-300 p-4 pl-3 focus:outline-none resize-none h-full font-mono text-sm leading-6 overflow-y-auto selection:bg-amber-500/30 selection:text-white ${readOnly ? "cursor-default opacity-80" : ""}`}
          value={value}
          onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={() => { if (taRef.current && gutterRef.current) gutterRef.current.scrollTop = taRef.current.scrollTop; }}
          readOnly={readOnly} spellCheck={false} autoCapitalize="none" autoCorrect="off" />
      </div>
    </div>
  );
}

// ─── Test result row ──────────────────────────────────────────────────────────
function TestResultRow({ result }: { result: TestResult }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-lg border p-3 ${result.passed ? "border-green-700/40 bg-green-900/10" : "border-red-700/40 bg-red-900/10"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{result.passed ? "✅" : "❌"}</span>
          <span className="text-sm font-medium text-slate-200">{result.label}</span>
          {result.isBoundary && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-600/30 font-bold">⚠ boundary</span>}
        </div>
        {!result.passed && <button onClick={() => setOpen(!open)} className="text-xs text-slate-400 hover:text-slate-200">{open ? "▲ less" : "▼ details"}</button>}
      </div>
      {!result.passed && open && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <div className="text-slate-500 mb-1">Expected:</div>
            <pre className="bg-green-900/20 border border-green-700/30 rounded p-2 text-green-300 whitespace-pre-wrap break-words">{result.expected}</pre>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Got:</div>
            <pre className={`rounded p-2 whitespace-pre-wrap break-words border ${result.error ? "bg-red-900/30 border-red-700/30 text-red-300" : "bg-slate-900 border-slate-700 text-slate-300"}`}>
              {result.error ? `🚨 ${result.error}` : result.got || "(empty)"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const pct = Math.round(score * 100), r = 32, c = 2 * Math.PI * r;
  const color = pct >= 80 ? "#22c55e" : pct >= 40 ? "#eab308" : "#ef4444";
  return (
    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
      <svg width="80" height="80" className="-rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-white">{pct}%</span>
        <span className="text-[9px] text-slate-400 font-semibold">score</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function YamunaProblemEngine({ program, onComplete, onExit }: Props) {
  const { execute, isLoading: javaLoading } = useJavaExecutor();

  // ── State ──
  const [stage,          setStage]          = useState<Stage>("coding");
  const [leftTab,        setLeftTab]         = useState<LeftTab>("problem");
  const [code,           setCode]            = useState(program.starterCode);
  const [hintsRevealed,  setHintsRevealed]   = useState(0);
  const [failedAttempts, setFailedAttempts]  = useState(0);
  const [testResults,    setTestResults]     = useState<TestResult[]>([]);
  const [runtimeError,   setRuntimeError]    = useState<string | null>(null);
  const [score,          setScore]           = useState(0);
  const [xpEarned,       setXpEarned]        = useState(0);
  const [xpAnimating,    setXpAnimating]     = useState(false);
  const [decision,       setDecision]        = useState<"next_tier" | "next_program" | "show_reference">("next_program");
  const [startTime,      setStartTime]       = useState(() => Date.now());
  const [secondsElapsed, setSecondsElapsed]  = useState(0);
  const [quickRunOutput, setQuickRunOutput]  = useState<{ stdout: string; error?: string } | null>(null);
  const [quickRunning,   setQuickRunning]    = useState(false);
  const [running,        setRunning]         = useState(false);
  const [userStdin,      setUserStdin]       = useState("");
  const [mobilePanel,    setMobilePanel]     = useState(false);

  // Reset on program change
  useEffect(() => {
    setStage("coding"); setLeftTab("problem"); setCode(program.starterCode);
    setHintsRevealed(0); setFailedAttempts(0); setTestResults([]); setRuntimeError(null);
    setScore(0); setXpEarned(0); setXpAnimating(false); setDecision("next_program");
    setStartTime(Date.now()); setSecondsElapsed(0); setQuickRunOutput(null);
    setUserStdin(""); setMobilePanel(false);
  }, [program.id, program.starterCode]);

  // Timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    setStartTime(Date.now());
    timerRef.current = setInterval(() => setSecondsElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []); // eslint-disable-line

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ── Quick Run ──────────────────────────────────────────────────────────────
  const handleQuickRun = useCallback(async () => {
    setQuickRunning(true); setQuickRunOutput(null);
    const stdinLines = userStdin.trim() ? userStdin.split("\n").map(l => l.trimEnd()) : [];
    const result = await execute(code, stdinLines);
    setQuickRunOutput(result); setQuickRunning(false);
  }, [code, userStdin, execute]);

  // ── Submit (run all tests) ─────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setRunning(true); setRuntimeError(null); setQuickRunOutput(null);
    const visible = program.testCases.filter(tc => !tc.isHidden);
    const results: TestResult[] = [];

    for (const tc of visible) {
      const { stdout, error } = await execute(code, tc.mockInputs);
      const got = stdout.trimEnd(), expected = tc.expectedOutput.trimEnd();
      results.push({ id: tc.id, label: tc.label, passed: !error && outputsMatch(got, expected), expected, got, isBoundary: tc.isBoundary ?? false, error });
    }

    setTestResults(results);
    setLeftTab("tests");

    const passed = results.filter(r => r.passed).length;
    const total  = results.length;
    const boundaryPassed = results.filter(r => r.isBoundary).every(r => r.passed);
    const solved = passed === total;

    if (!solved) {
      setFailedAttempts(f => f + 1);
      if (passed === 0) { const e = results.find(r => r.error)?.error; if (e) setRuntimeError(e); }
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const s = computeProgramScore({ programId: program.id, solved, hintsUsed: hintsRevealed, failedAttempts: solved ? failedAttempts : failedAttempts + 1, secondsElapsed: elapsed, testCasesPassed: passed, totalTestCases: total, boundaryPassed });
    const dec = adaptiveDecision(s);
    const xp = solved ? Math.round(program.xpReward * s) : 0;

    setScore(s); setDecision(dec); setXpEarned(xp); setRunning(false);
    if (solved) { setStage("passed"); setTimeout(() => setXpAnimating(true), 400); }
    else { setStage("coding"); }
  }, [code, program, execute, hintsRevealed, failedAttempts, startTime]);

  // ── Left panel tabs ────────────────────────────────────────────────────────
  const renderProblemTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-4xl select-none">{program.emoji}</span>
        <div>
          <h2 className="text-base font-black text-white leading-tight">{program.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{program.tagline}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <TierBadge tier={program.tier} />
            <span className="text-[11px] text-slate-500">~{program.estimatedMinutes} min · {program.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Problem</h3>
        <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-sans">{program.problemStatement}</pre>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Input</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{program.inputFormat}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Output</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{program.outputFormat}</p>
        </div>
      </div>

      <div className="space-y-2">
        {program.examples.map((ex, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-slate-800 text-xs font-mono">
            <div className="text-[10px] text-slate-500 font-sans px-3 pt-2 pb-0.5 font-semibold uppercase tracking-wider">Example {i + 1}</div>
            <div className="px-3 py-1.5 bg-slate-950/60 flex gap-2 border-t border-slate-800">
              <span className="text-blue-400 font-sans font-semibold shrink-0">Input:</span>
              <pre className="text-blue-300 whitespace-pre-wrap">{ex.input}</pre>
            </div>
            <div className="px-3 py-1.5 flex gap-2 border-t border-slate-800">
              <span className="text-green-400 font-sans font-semibold shrink-0">Output:</span>
              <pre className="text-green-300 whitespace-pre-wrap">{ex.output}</pre>
            </div>
            {ex.explanation && (
              <div className="px-3 py-1.5 border-t border-slate-800 text-slate-400 font-sans text-[11px]">💬 {ex.explanation}</div>
            )}
          </div>
        ))}
      </div>

      {program.constraints.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Constraints</h3>
          <ul className="space-y-1">
            {program.constraints.map((c, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-amber-400 shrink-0">▸</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {program.concepts.map(c => (
          <span key={c} className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{c}</span>
        ))}
      </div>

      {program.timeComplexityTarget && (
        <div className="text-xs text-slate-500 border border-slate-800 rounded-lg px-3 py-2">
          🎯 Target complexity: <span className="text-yellow-400 font-mono">{program.timeComplexityTarget}</span>
        </div>
      )}
    </div>
  );

  const renderHintsTab = () => (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white mb-1">💡 Hints</h3>
        <p className="text-xs text-slate-500">Hints cost <span className="text-red-400">-12% score</span> each. Use only when stuck.</p>
      </div>
      <div className="space-y-3">
        {program.hints.slice(0, hintsRevealed).map((hint, i) => (
          <div key={i} className="flex gap-3 text-sm text-slate-300 bg-amber-900/15 border border-amber-700/30 rounded-xl px-3 py-2.5">
            <span className="text-amber-400 font-bold shrink-0">{i + 1}.</span>
            <span className="leading-relaxed">{hint}</span>
          </div>
        ))}
        {hintsRevealed < program.hints.length ? (
          <button onClick={() => setHintsRevealed(h => h + 1)}
            className="w-full py-3 rounded-xl border border-dashed border-amber-700/50 text-amber-400 text-sm font-semibold hover:bg-amber-900/15 transition-colors">
            Reveal hint {hintsRevealed + 1} of {program.hints.length}
          </button>
        ) : (
          <p className="text-xs text-slate-600 text-center">All hints revealed</p>
        )}
        {hintsRevealed === 0 && <p className="text-xs text-slate-600 text-center italic">No hints revealed yet</p>}
      </div>

      {failedAttempts >= 3 && program.referenceProgram && (
        <div className="mt-4 border border-amber-600/40 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-amber-900/20 border-b border-amber-700/30">
            <span className="text-amber-400 text-sm font-bold">📖 Reference: {program.referenceProgram.title}</span>
          </div>
          <div className="p-3 bg-amber-900/10">
            <p className="text-xs text-amber-300/70 mb-2">{program.referenceProgram.description}</p>
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-amber-300 text-xs font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
              {program.referenceProgram.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  const renderTestsTab = () => {
    if (testResults.length === 0) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center gap-3 opacity-60 select-none">
          <span className="text-3xl">🧪</span>
          <p className="text-slate-500 text-sm">No results yet.<br />Click <strong className="text-green-400">Submit</strong> to run all test cases.</p>
        </div>
      );
    }
    const passed = testResults.filter(r => r.passed).length;
    const total  = testResults.length;
    const allPassed = passed === total;
    return (
      <div className="p-4 space-y-3">
        <div className={`rounded-xl border p-3 flex items-center gap-3 ${allPassed ? "border-green-700/40 bg-green-900/10" : "border-red-700/30 bg-red-900/10"}`}>
          <span className="text-2xl">{allPassed ? "✅" : "❌"}</span>
          <div>
            <div className="text-sm font-bold text-white">{passed}/{total} tests passed</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {hintsRevealed > 0 && `${hintsRevealed} hint${hintsRevealed !== 1 ? "s" : ""} · `}
              {failedAttempts > 0 && `${failedAttempts} attempt${failedAttempts !== 1 ? "s" : ""}`}
            </div>
          </div>
          {testResults.length > 0 && <ScoreRing score={score} />}
        </div>
        <div className="space-y-2">{testResults.map(r => <TestResultRow key={r.id} result={r} />)}</div>
        {runtimeError && (
          <div className="rounded-lg border border-red-700/40 bg-red-900/20 px-4 py-3 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">
            🚨 {runtimeError}
          </div>
        )}
        {!allPassed && (
          <button onClick={() => { setStage("coding"); setRuntimeError(null); }}
            className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-bold text-sm transition-colors">
            ← Fix & Retry
          </button>
        )}
      </div>
    );
  };

  // ── Passed overlay ────────────────────────────────────────────────────────
  const renderPassedOverlay = () => {
    const pct = Math.round(score * 100);
    const scoreColor = pct >= 80 ? "text-green-400" : pct >= 40 ? "text-yellow-400" : "text-red-400";
    return (
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-md w-full space-y-5 text-center my-auto">
          <div className="text-6xl">{pct >= 80 ? "🏆" : pct >= 40 ? "🎯" : "📘"}</div>
          <div>
            <h2 className="text-2xl font-black text-white">{program.title}</h2>
            <p className="text-slate-400 text-sm mt-1">{program.tagline}</p>
          </div>

          <div className={`rounded-2xl border p-5 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-700/30 transition-all duration-700 ${xpAnimating ? "scale-100 opacity-100" : "scale-95 opacity-70"}`}>
            <div className={`text-5xl font-black ${xpAnimating ? scoreColor : "text-slate-500"} transition-all duration-700`}>+{xpEarned} XP</div>
            <div className="text-slate-400 text-sm mt-1">of {program.xpReward} possible</div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Score Breakdown</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-300"><span>Base score</span><span className="font-mono">1.00</span></div>
              {hintsRevealed > 0 && <div className="flex justify-between text-red-400"><span>Hints ({hintsRevealed})</span><span className="font-mono">-{(hintsRevealed * 0.12).toFixed(2)}</span></div>}
              {failedAttempts > 0 && <div className="flex justify-between text-red-400"><span>Failed attempts ({failedAttempts})</span><span className="font-mono">-{(failedAttempts * 0.08).toFixed(2)}</span></div>}
              {secondsElapsed < 120 && <div className="flex justify-between text-green-400"><span>Speed bonus</span><span className="font-mono">+0.05</span></div>}
              <div className={`flex justify-between font-bold border-t border-slate-700 pt-2 ${scoreColor}`}>
                <span>Final</span><span className="font-mono">{score.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {program.concepts.map(c => (
              <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-green-900/30 border border-green-700/40 text-green-300">✓ {c}</span>
            ))}
          </div>

          {program.referenceProgram && (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">📖 Model Solution</h3>
              <p className="text-[11px] text-slate-500 mb-2">Compare your approach — there's always more than one right way.</p>
              <pre className="bg-slate-950 text-amber-300 text-xs font-mono p-3 rounded-lg whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {program.referenceProgram.code}
              </pre>
            </div>
          )}

          {program.designChallenge && (
            <div className="rounded-xl border border-purple-700/30 bg-purple-900/10 p-4 text-left">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">🏆 Design Challenge</h3>
              <p className="text-sm text-purple-200">{program.designChallenge}</p>
            </div>
          )}

          <button
            onClick={() => onComplete({
              programId: program.id, score, decision, xpEarned,
              hintsUsed: hintsRevealed, failedAttempts,
              testCasesPassed: testResults.filter(r => r.passed).length,
              totalTestCases: testResults.length, secondsElapsed,
            })}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-lg transition-all shadow-lg shadow-amber-900/50 active:scale-95">
            {decision === "next_tier" ? "Advance to next tier ⬆" : "Next Program →"}
          </button>
        </div>
      </div>
    );
  };

  // ── Root render ───────────────────────────────────────────────────────────
  const allPassed = testResults.length > 0 && testResults.every(r => r.passed);

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative">

      {/* ── Top nav bar ──────────────────────────────────────────────────── */}
      <div className="h-11 flex-shrink-0 bg-slate-900/95 border-b border-slate-800 px-3 flex items-center gap-3 select-none z-30">
        {onExit && (
          <button onClick={onExit} className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 flex-shrink-0">
            ← Course
          </button>
        )}
        <span className="text-slate-700">|</span>
        <button onClick={() => setMobilePanel(p => !p)}
          className="md:hidden text-xs font-semibold text-amber-400 border border-amber-500/30 px-2 py-1 rounded-lg flex-shrink-0">
          📋 Problem
        </button>
        <span className="text-sm font-semibold text-slate-200 truncate flex-1 hidden md:block">
          {program.emoji} {program.title}
        </span>
        <div className="flex items-center gap-3 ml-auto flex-shrink-0">
          <TierBadge tier={program.tier} />
          <span className="text-xs text-slate-500 font-mono hidden sm:block">⏱ {fmtTime(secondsElapsed)}</span>
          <div className={`flex items-center gap-1 text-xs ${javaLoading ? "text-yellow-400" : "text-amber-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${javaLoading ? "bg-yellow-400 animate-pulse" : "bg-amber-400"}`} />
            <span className="hidden sm:block">{javaLoading ? "Loading…" : "Ready"}</span>
          </div>
          {testResults.length > 0 && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${allPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {testResults.filter(r => r.passed).length}/{testResults.length} tests
            </span>
          )}
        </div>
      </div>

      {/* ── Main split area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">

        {/* Mobile backdrop */}
        {mobilePanel && <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={() => setMobilePanel(false)} />}

        {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
        <div className={`
          flex-shrink-0 flex flex-col bg-slate-900 border-r border-slate-800
          w-full md:w-[42%] lg:w-[40%] xl:w-[38%]
          ${mobilePanel ? "fixed inset-y-0 left-0 z-30 w-[90vw] max-w-sm" : "hidden md:flex"}
        `}>
          {/* Tab bar */}
          <div className="flex-shrink-0 flex border-b border-slate-800 bg-slate-950">
            {(["problem", "hints", "tests"] as LeftTab[]).map(tab => {
              const labels: Record<LeftTab, string> = { problem: "📋 Problem", hints: "💡 Hints", tests: "🧪 Tests" };
              const active = leftTab === tab;
              return (
                <button key={tab} onClick={() => setLeftTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-bold transition-colors relative ${active ? "text-amber-400 bg-slate-900" : "text-slate-500 hover:text-slate-300"}`}>
                  {labels[tab]}
                  {tab === "tests" && testResults.length > 0 && (
                    <span className={`ml-1 text-[10px] font-black ${allPassed ? "text-green-400" : "text-red-400"}`}>
                      ({testResults.filter(r => r.passed).length}/{testResults.length})
                    </span>
                  )}
                  {tab === "hints" && hintsRevealed > 0 && <span className="ml-1 text-[10px] text-amber-400">({hintsRevealed})</span>}
                  {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {leftTab === "problem" && renderProblemTab()}
            {leftTab === "hints"   && renderHintsTab()}
            {leftTab === "tests"   && renderTestsTab()}
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-slate-950">

          {/* Status strip */}
          <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 bg-slate-900/50 border-b border-slate-800/50 text-[11px] text-slate-500">
            <span>
              Attempt {failedAttempts + 1}
              {hintsRevealed > 0 && <span className="text-amber-400 ml-1">· {hintsRevealed} hint{hintsRevealed !== 1 ? "s" : ""}</span>}
              {failedAttempts > 0 && <span className="text-red-400 ml-1">· {failedAttempts} failed</span>}
            </span>
            <span className="text-slate-600">Ch.{program.chapterNumber} · {program.xpReward} XP available</span>
          </div>

          {/* Code editor */}
          <div className="flex-1 min-h-0 p-2 flex flex-col">
            <JavaEditor value={code} onChange={setCode} />
          </div>

          {/* stdin */}
          <div className="flex-shrink-0 mx-2 mb-2 rounded-xl overflow-hidden border border-amber-900/40 bg-slate-900">
            <div className="bg-slate-800/50 px-3 py-1.5 border-b border-slate-800 flex items-center gap-2 select-none">
              <span className="text-amber-400 text-xs">📥</span>
              <span className="text-xs font-bold text-slate-300">stdin</span>
              <span className="text-[10px] text-slate-500 ml-auto">type Scanner input values, one per line · used by ▶ Run</span>
            </div>
            <textarea
              value={userStdin} onChange={e => setUserStdin(e.target.value)}
              placeholder={"5\nAlex\n100"}
              className="w-full bg-transparent text-amber-300 font-mono text-xs p-2.5 resize-none focus:outline-none leading-5 placeholder:text-slate-700"
              rows={2} spellCheck={false} autoCapitalize="none" autoCorrect="off" />
          </div>

          {/* Action buttons */}
          <div className="flex-shrink-0 flex gap-2 px-2 pb-2">
            <button onClick={() => setLeftTab("hints")}
              className="px-3 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors flex-shrink-0">
              💡 Hints
            </button>
            <button onClick={handleQuickRun} disabled={quickRunning || javaLoading}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 flex-shrink-0 ${quickRunning || javaLoading ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-900/30"}`}>
              {quickRunning
                ? <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #78716c", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : "▶ Run"}
            </button>
            <button onClick={handleSubmit} disabled={running || javaLoading}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${running || javaLoading ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40"}`}>
              {running ? "⏳ Running tests…" : javaLoading ? "⏳ Loading…" : "✓ Submit"}
            </button>
            <button
              onClick={() => onComplete({
                programId: program.id, score: 0, decision: "next_program", xpEarned: 0,
                hintsUsed: hintsRevealed, failedAttempts,
                testCasesPassed: testResults.filter(r => r.passed).length,
                totalTestCases: program.testCases.filter(t => !t.isHidden).length,
                secondsElapsed: Math.floor((Date.now() - startTime) / 1000),
              })}
              className="px-3 py-2.5 rounded-xl border border-slate-800 text-slate-600 hover:text-slate-400 text-sm font-semibold transition-colors flex-shrink-0"
              title="Skip this problem">
              Skip
            </button>
          </div>

          {/* Output terminal */}
          <div className="flex-shrink-0 mx-2 mb-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-sm" style={{ minHeight: "9rem", maxHeight: "14rem" }}>
            <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between select-none">
              <span className="text-xs text-slate-400 font-semibold">⬛ Output</span>
              {quickRunOutput && <button onClick={() => setQuickRunOutput(null)} className="text-[10px] text-slate-600 hover:text-slate-400">Clear</button>}
            </div>
            <div className="p-3 overflow-y-auto" style={{ maxHeight: "calc(14rem - 2rem)" }}>
              {!quickRunOutput && !quickRunning && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-4 select-none opacity-50">
                  <span className="text-xl">▶</span>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    <span className="text-amber-400 font-bold">▶ Run</span> — test with your stdin<br />
                    <span className="text-green-400 font-bold">✓ Submit</span> — run all test cases
                  </p>
                </div>
              )}
              {quickRunning && (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid #475569", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Compiling &amp; executing…
                </div>
              )}
              {quickRunOutput && !quickRunning && (
                quickRunOutput.error ? (
                  <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {"🚨 ERROR\n" + quickRunOutput.error + "\n\n=== Compilation/Runtime Error ==="}
                  </pre>
                ) : (
                  <div>
                    <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                      {quickRunOutput.stdout || "(no output — did you forget System.out.println()?)"}
                    </pre>
                    <p className="text-slate-600 text-[10px] mt-2 border-t border-slate-800 pt-2">=== Exited Successfully ===</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Passed overlay */}
      {stage === "passed" && renderPassedOverlay()}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
