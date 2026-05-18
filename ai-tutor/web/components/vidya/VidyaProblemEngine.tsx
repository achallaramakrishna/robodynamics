"use client";

/**
 * VidyaProblemEngine — 5-stage adaptive coding challenge UI
 *
 * Stage flow: UNDERSTAND → DESIGN → CODE → TEST → REFLECT
 *
 * Key features:
 * - In-browser Python execution via Pyodide (silent input() mock)
 * - Progressive hint reveal (one at a time, max 5)
 * - Reference program shown after 3 failed attempts
 * - Score-based adaptive routing via computeProgramScore + adaptiveDecision
 * - XP award animation on REFLECT stage
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePyodide } from "../../hooks/usePyodide";
import type { VidyaProgram, TestCase } from "../../lib/vidyaProgramTypes";
import {
  TIER_META,
  computeProgramScore,
  adaptiveDecision,
} from "../../lib/vidyaProgramTypes";

// ─── Semantic output comparison ───────────────────────────────────────────────
//
// Python is about logic, not output formatting. A student who prints "Grade A"
// instead of "Grade: A" has understood conditionals perfectly.
//
// Three-tier matching (each tier is tried in order):
//   Tier 1 — EXACT:      trimmed byte-for-byte match       "Grade: A" === "Grade: A"
//   Tier 2 — NORMALIZED: strip punctuation + lowercase     "grade a"  === "grade a"
//   Tier 3 — WORD-SET:   same words, any order             {"A","Grade"} == {"Grade","A"}
//
// Numbers and multiline output are compared line-by-line so each line is
// individually normalized (stops "5 0" matching "50").

function normalizeToken(s: string): string {
  return s
    .toLowerCase()
    // Remove all punctuation EXCEPT decimal points inside numbers (e.g. 3.14)
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

/**
 * Returns true if `got` is semantically equivalent to `expected`.
 * Multi-line outputs are compared line-by-line with the same 3-tier logic.
 */
function outputsMatch(got: string, expected: string): boolean {
  const gLines = got.trimEnd().split("\n");
  const eLines = expected.trimEnd().split("\n");

  // Different number of lines → definitely wrong
  if (gLines.length !== eLines.length) return false;

  return gLines.every((gLine, i) => {
    const eLine = eLines[i];
    const g = gLine.trimEnd();
    const e = eLine.trimEnd();

    // Tier 1 — exact
    if (g === e) return true;

    // Tier 2 — normalized (strip punctuation, lowercase, collapse whitespace)
    const gNorm = normalizeToken(g);
    const eNorm = normalizeToken(e);
    if (gNorm === eNorm) return true;

    // Tier 3 — word-set (same words, any order)
    const gWords = wordsOf(gNorm).join("|");
    const eWords = wordsOf(eNorm).join("|");
    if (gWords === eWords) return true;

    return false;
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = "understand" | "design" | "code" | "test" | "reflect";

interface TestResult {
  id: string;
  label: string;
  passed: boolean;
  expected: string;
  got: string;
  isBoundary: boolean;
  error?: string;
}

interface VidyaProblemEngineProps {
  program: VidyaProgram;
  onComplete: (params: {
    programId: string;
    score: number;
    decision: "next_tier" | "next_program" | "show_reference";
    xpEarned: number;
    hintsUsed: number;
    failedAttempts: number;
    testCasesPassed: number;
    totalTestCases: number;
    secondsElapsed: number;
  }) => void;
  /** Optional — if provided, renders a back/exit button */
  onExit?: () => void;
}

// ─── Stage progress bar ───────────────────────────────────────────────────────

const STAGES: Stage[] = ["understand", "design", "code", "test", "reflect"];
const STAGE_LABELS: Record<Stage, string> = {
  understand: "Understand",
  design: "Design",
  code: "Code",
  test: "Test",
  reflect: "Reflect",
};
const STAGE_ICONS: Record<Stage, string> = {
  understand: "📖",
  design: "✏️",
  code: "💻",
  test: "🧪",
  reflect: "🌟",
};

function StageBar({ current }: { current: Stage }) {
  const currentIdx = STAGES.indexOf(current);
  return (
    <div className="flex items-center gap-0 w-full mb-6 select-none">
      {STAGES.map((stage, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all ${
                  active
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30"
                    : done
                    ? "bg-green-600 border-green-400 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-500"
                }`}
              >
                {done ? "✓" : STAGE_ICONS[stage]}
              </div>
              <span
                className={`hidden sm:block text-[10px] mt-1 font-semibold uppercase tracking-wide ${
                  active ? "text-indigo-400" : done ? "text-green-400" : "text-slate-600"
                }`}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
            {idx < STAGES.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-5 transition-colors ${
                  idx < currentIdx ? "bg-green-500" : "bg-slate-700"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Tier badge ───────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: VidyaProgram["tier"] }) {
  const meta = TIER_META[tier];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border"
      style={{ color: meta.color, borderColor: meta.color + "55", background: meta.color + "18" }}
    >
      {meta.emoji} {meta.label}
    </span>
  );
}

// ─── Code editor (reuses VidyaLessonEngine style) ────────────────────────────

interface EditorProps {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  heightClass?: string;
}

function PythonEditor({ value, onChange, readOnly = false, heightClass = "h-72" }: EditorProps) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const lines = value.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const ta = textareaRef.current;
      if (ta) { ta.select(); document.execCommand("copy"); }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const end = ta.selectionEnd;
      const nv = value.substring(0, s) + "    " + value.substring(end);
      onChange(nv);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl flex flex-col font-mono text-sm">
      {/* chrome bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between select-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-xs text-slate-400 font-semibold">🐍 main.py</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            title="Copy code to clipboard — paste into VS Code or any editor"
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 px-2 py-0.5 rounded"
            style={{
              color: copied ? "#4ade80" : "#64748b",
              background: copied ? "#052e1680" : "transparent",
              border: copied ? "1px solid #16a34a40" : "1px solid transparent",
            }}
          >
            {copied ? (
              <><span>✓</span><span>Copied!</span></>
            ) : (
              <><span>⎘</span><span>Copy</span></>
            )}
          </button>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Python 3.10
          </span>
        </div>
      </div>
      {/* editor body */}
      <div className={`flex bg-slate-950 ${heightClass} relative`}>
        <div
          ref={gutterRef}
          className="w-11 select-none text-slate-600 text-right pr-3 py-4 border-r border-slate-900 overflow-hidden leading-6 font-mono text-xs bg-slate-900/40"
        >
          {lines.map((_, i) => <div key={i} className="h-6">{i + 1}</div>)}
        </div>
        <textarea
          ref={textareaRef}
          className={`flex-1 bg-transparent text-green-400 p-4 pl-3 focus:outline-none resize-none h-full font-mono text-sm leading-6 overflow-y-auto selection:bg-indigo-500/30 selection:text-white ${readOnly ? "cursor-default opacity-80" : ""}`}
          value={value}
          onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// ─── Collapsible reference program panel ─────────────────────────────────────

function ReferencePanel({ ref: refProg }: { ref: NonNullable<VidyaProgram["referenceProgram"]> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border border-amber-600/40 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-amber-900/20 hover:bg-amber-900/30 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-amber-400">
          💡 Reference: {refProg.title}
        </span>
        <span className="text-amber-500 text-xs">{open ? "▲ hide" : "▼ show"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 bg-amber-900/10">
          <p className="text-xs text-amber-300/70 mb-2 mt-1">{refProg.description}</p>
          <PythonEditor value={refProg.code} onChange={() => {}} readOnly heightClass="h-48" />
        </div>
      )}
    </div>
  );
}

// ─── Test result row ──────────────────────────────────────────────────────────

function TestResultRow({ result }: { result: TestResult }) {
  const [showDiff, setShowDiff] = useState(false);
  return (
    <div
      className={`rounded-lg border p-3 ${
        result.passed
          ? "border-green-700/40 bg-green-900/10"
          : "border-red-700/40 bg-red-900/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{result.passed ? "✅" : "❌"}</span>
          <span className="text-sm font-medium text-slate-200">{result.label}</span>
          {result.isBoundary && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-600/30 font-bold">
              ⚠ boundary
            </span>
          )}
        </div>
        {!result.passed && (
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            {showDiff ? "▲ less" : "▼ details"}
          </button>
        )}
      </div>
      {!result.passed && showDiff && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
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
  const pct = Math.round(score * 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;
  const color = pct >= 80 ? "#22c55e" : pct >= 40 ? "#eab308" : "#ef4444";
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white">{pct}%</span>
        <span className="text-[10px] text-slate-400 font-semibold">score</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VidyaProblemEngine({
  program,
  onComplete,
  onExit,
}: VidyaProblemEngineProps) {
  const { pyodide, isLoading: pyodideLoading } = usePyodide();

  // ── State ──
  const [stage, setStage] = useState<Stage>("understand");
  const [code, setCode] = useState(program.starterCode);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [xpAnimating, setXpAnimating] = useState(false);
  const [decision, setDecision] = useState<"next_tier" | "next_program" | "show_reference">("next_program");

  // Quick-run state (▶ Run button — raw output only, no expected shown during work)
  const [quickRunOutput, setQuickRunOutput] = useState<{ stdout: string; error?: string } | null>(null);
  const [quickRunning, setQuickRunning] = useState(false);
  // Student-supplied stdin (one value per line) used by ▶ Run
  const [userStdin, setUserStdin] = useState("");

  // Reset when program changes
  useEffect(() => {
    setStage("understand");
    setCode(program.starterCode);
    setHintsRevealed(0);
    setFailedAttempts(0);
    setRunning(false);
    setTestResults([]);
    setRuntimeError(null);
    setScore(0);
    setSecondsElapsed(0);
    setQuickRunOutput(null);
    setXpEarned(0);
    setXpAnimating(false);
    setUserStdin("");
  }, [program.id, program.starterCode]);

  // ── Timer ──
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (stage === "code") {
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setSecondsElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Python executor ───────────────────────────────────────────────────────
  //
  // Fix #2: each call uses exec() in a *fresh namespace* so test-case globals
  //         never leak into the next test-case run.
  // Fix #3: `input` is injected directly into the exec namespace so it always
  //         resolves to the mock regardless of builtins import order.
  // echoInput=true: mirrors a real terminal by printing prompt + typed value.
  const runSilent = useCallback(
    async (code: string, mockInputs: string[], echoInput = false): Promise<{ stdout: string; error?: string }> => {
      if (!pyodide) return { stdout: "", error: "Pyodide is still loading…" };
      try {
        const inputsJson = JSON.stringify(mockInputs);
        const codeJson   = JSON.stringify(code);
        const echoLine   = echoInput
          ? `sys.stdout.write(str(prompt) + str(val) + "\\n")`
          : ``;

        // 1. Set up fresh I/O capture buffers and define the input mock
        pyodide.runPython(`
import sys, io
import builtins as _bi
_out = io.StringIO()
_err = io.StringIO()
sys.stdout = _out
sys.stderr = _err
_mock_inputs = ${inputsJson}
_input_idx = 0
def _mock_input(prompt=""):
    global _input_idx
    if _input_idx < len(_mock_inputs):
        val = _mock_inputs[_input_idx]
        _input_idx += 1
        ${echoLine}
        return val
    return ""
_bi.input = _mock_input
`);

        // 2. Execute student code in an isolated namespace (no shared globals)
        await Promise.race([
          pyodide.runPythonAsync(`
_ns = {"__builtins__": _bi, "input": _mock_input}
exec(${codeJson}, _ns)
`),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(
              "⏱ Execution timed out (5 seconds).\n" +
              "Your code may have an infinite loop.\n\n" +
              "💡 Check your while/for loop condition — make sure it eventually becomes False."
            )), 5000)
          ),
        ]);

        const stdout: string = pyodide.runPython("_out.getvalue()");
        const stderr: string = pyodide.runPython("_err.getvalue()");
        return { stdout: (stdout + (stderr || "")).trimEnd() };
      } catch (err: any) {
        return { stdout: "", error: String(err) };
      }
    },
    [pyodide]
  );

  // ── Quick run (▶ Run) — uses student-supplied stdin, echoes like a real terminal ─
  const handleQuickRun = useCallback(async () => {
    if (!pyodide) return;
    setQuickRunning(true);
    setQuickRunOutput(null);
    // Split the stdin textarea into per-line values (what the student typed)
    const mockInputs = userStdin.trim()
      ? userStdin.split("\n").map((l) => l.trimEnd())
      : [];
    const { stdout, error } = await runSilent(code, mockInputs, true /* echo prompts */);
    setQuickRunOutput({ stdout: stdout.trimEnd(), error });
    setQuickRunning(false);
  }, [pyodide, code, userStdin, runSilent]);

  // ── Run all test cases ────────────────────────────────────────────────────
  const handleRunTests = useCallback(async () => {
    if (!pyodide) return;
    setRunning(true);
    setRuntimeError(null);

    const visibleCases = program.testCases.filter((tc) => !tc.isHidden);
    const results: TestResult[] = [];

    for (const tc of visibleCases) {
      const { stdout, error } = await runSilent(code, tc.mockInputs);
      const got = stdout.trimEnd();
      const expected = tc.expectedOutput.trimEnd();
      results.push({
        id: tc.id,
        label: tc.label,
        passed: !error && outputsMatch(got, expected),
        expected,
        got,
        isBoundary: tc.isBoundary ?? false,
        error,
      });
    }

    setTestResults(results);
    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    const boundaryPassed = results.filter((r) => r.isBoundary).every((r) => r.passed);
    const solved = passed === total;

    if (!solved) {
      const newFails = failedAttempts + 1;
      setFailedAttempts(newFails);
      // Show a global error summary if zero passed
      if (passed === 0) {
        const firstError = results.find((r) => r.error)?.error;
        if (firstError) setRuntimeError(firstError);
      }
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const computedScore = computeProgramScore({
      programId: program.id,
      solved,
      hintsUsed: hintsRevealed,
      failedAttempts: solved ? failedAttempts : failedAttempts + 1,
      secondsElapsed: elapsed,
      testCasesPassed: passed,
      totalTestCases: total,
      boundaryPassed,
    });

    const dec = adaptiveDecision(computedScore);
    const xp = solved ? Math.round(program.xpReward * computedScore) : 0;

    setScore(computedScore);
    setDecision(dec);
    setXpEarned(xp);
    setRunning(false);
    setStage("test");

    // Animate XP if earned
    if (xp > 0) setTimeout(() => setXpAnimating(true), 400);
  }, [pyodide, code, program, runSilent, hintsRevealed, failedAttempts, startTime]);

  // ── Stage: UNDERSTAND ─────────────────────────────────────────────────────
  const renderUnderstand = () => (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="text-5xl select-none">{program.emoji}</div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <TierBadge tier={program.tier} />
            <span className="text-xs text-slate-500">Ch.{program.chapterNumber} · ~{program.estimatedMinutes} min · {program.xpReward} XP</span>
          </div>
          <h2 className="text-xl font-black text-white">{program.title}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{program.tagline}</p>
        </div>
      </div>

      {/* Problem statement */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Problem</h3>
        <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-sans">{program.problemStatement}</pre>
      </div>

      {/* I/O format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Input</h4>
          <p className="text-sm text-slate-300">{program.inputFormat}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Output</h4>
          <p className="text-sm text-slate-300">{program.outputFormat}</p>
        </div>
      </div>

      {/* Examples */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Examples</h3>
        <div className="space-y-3">
          {program.examples.map((ex, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <div className="text-slate-500 mb-1 font-sans">Input {i + 1}</div>
                <pre className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-blue-300 whitespace-pre-wrap">{ex.input}</pre>
              </div>
              <div>
                <div className="text-slate-500 mb-1 font-sans">Output {i + 1}</div>
                <pre className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-green-300 whitespace-pre-wrap">{ex.output}</pre>
              </div>
              {ex.explanation && (
                <p className="col-span-2 text-slate-400 font-sans text-xs">💬 {ex.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      {program.constraints.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Constraints</h3>
          <ul className="space-y-1">
            {program.constraints.map((c, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">▸</span> {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concepts */}
      <div className="flex flex-wrap gap-2">
        {program.concepts.map((c) => (
          <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-medium">
            {c}
          </span>
        ))}
      </div>

      <button
        onClick={() => setStage("design")}
        className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-lg shadow-indigo-900/40 active:scale-95"
      >
        I understand the problem → Design
      </button>
    </div>
  );

  // ── Stage: DESIGN ─────────────────────────────────────────────────────────
  const renderDesign = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-white">{program.emoji} {program.title}</h2>
        <p className="text-sm text-slate-400">Think through your approach before writing code.</p>
      </div>

      {/* Hint system */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            💡 Hints — {hintsRevealed}/{program.hints.length} revealed
          </h3>
          <span className="text-xs text-slate-600">
            {hintsRevealed > 0 ? "-" + (hintsRevealed * 12) + "% score" : "free tier"}
          </span>
        </div>
        <div className="space-y-3">
          {program.hints.slice(0, hintsRevealed).map((hint, i) => (
            <div key={i} className="flex gap-3 text-sm text-slate-300 bg-indigo-900/20 border border-indigo-700/30 rounded-lg px-3 py-2.5">
              <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
              <span>{hint}</span>
            </div>
          ))}
          {hintsRevealed < program.hints.length && (
            <button
              onClick={() => setHintsRevealed((h) => h + 1)}
              className="w-full py-2.5 rounded-lg border border-dashed border-indigo-700/50 text-indigo-400 text-sm font-semibold hover:bg-indigo-900/20 transition-colors"
            >
              Show hint {hintsRevealed + 1} of {program.hints.length}
            </button>
          )}
          {hintsRevealed === program.hints.length && (
            <p className="text-xs text-slate-600 text-center">All hints revealed</p>
          )}
        </div>
      </div>

      {/* Concepts reminder */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Concepts to use</h3>
        <div className="flex flex-wrap gap-2">
          {program.concepts.map((c) => (
            <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-indigo-900/30 border border-indigo-700/40 text-indigo-300 font-medium">
              {c}
            </span>
          ))}
        </div>
      </div>

      {program.timeComplexityTarget && (
        <div className="text-xs text-slate-500 border border-slate-800 rounded-lg px-3 py-2">
          🎯 Target time complexity: <span className="text-yellow-400 font-mono">{program.timeComplexityTarget}</span>
        </div>
      )}

      <button
        onClick={() => setStage("code")}
        className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-lg shadow-indigo-900/40 active:scale-95"
      >
        Start Coding →
      </button>
    </div>
  );

  // ── Stage: CODE (LeetCode-style: problem panel left, editor+output right) ──
  const renderCode = () => {
    const showRef = failedAttempts >= 3 && program.referenceProgram;

    return (
      <div className="space-y-3">
        {/* Compact status bar */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Attempt {failedAttempts + 1}
            {hintsRevealed > 0 && ` · ${hintsRevealed} hint${hintsRevealed !== 1 ? "s" : ""} used`}
            {failedAttempts > 0 && <span className="text-red-400"> · {failedAttempts} failed</span>}
          </span>
          <div className={`flex items-center gap-1.5 ${pyodideLoading ? "text-yellow-400" : "text-green-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pyodideLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
            {pyodideLoading ? "Loading Python…" : "Ready"}
          </div>
        </div>

        {/* ── LeetCode 2-panel layout ── */}
        <div className="flex flex-col lg:flex-row gap-3">

          {/* ── LEFT: Problem description panel ── */}
          <div className="w-full lg:w-[40%] flex-shrink-0 flex flex-col gap-3 lg:max-h-[640px] lg:overflow-y-auto lg:pr-1">

            {/* Title + problem statement */}
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl select-none">{program.emoji}</span>
                <div>
                  <h2 className="text-base font-black text-white">{program.title}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <TierBadge tier={program.tier} />
                    <span className="text-[11px] text-slate-500">~{program.estimatedMinutes} min · {program.xpReward} XP</span>
                  </div>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-sans">{program.problemStatement}</pre>
            </div>

            {/* Input / Output format */}
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

            {/* Examples */}
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Examples</h3>
              <div className="space-y-3">
                {program.examples.map((ex, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-slate-800 text-xs font-mono">
                    <div className="text-[10px] text-slate-500 font-sans px-3 pt-2 pb-0.5 font-semibold">Example {i + 1}</div>
                    <div className="px-3 py-1.5 bg-slate-950/60 flex gap-2 border-t border-slate-800">
                      <span className="text-blue-400 font-sans font-semibold shrink-0">Input:</span>
                      <pre className="text-blue-300 whitespace-pre-wrap">{ex.input}</pre>
                    </div>
                    <div className="px-3 py-1.5 flex gap-2 border-t border-slate-800">
                      <span className="text-green-400 font-sans font-semibold shrink-0">Output:</span>
                      <pre className="text-green-300 whitespace-pre-wrap">{ex.output}</pre>
                    </div>
                    {ex.explanation && (
                      <div className="px-3 py-1.5 border-t border-slate-800 text-slate-400 font-sans text-[11px]">
                        💬 {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            {program.constraints.length > 0 && (
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Constraints</h3>
                <ul className="space-y-1">
                  {program.constraints.map((c, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-indigo-400 shrink-0">▸</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Concepts */}
            <div className="flex flex-wrap gap-1.5">
              {program.concepts.map((c) => (
                <span key={c} className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Editor + stdin + buttons + output ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">

            {/* Code editor */}
            <PythonEditor value={code} onChange={setCode} heightClass="h-72 lg:h-80" />

            {/* stdin — type inputs here for ▶ Run */}
            <div className="rounded-lg border border-blue-900/40 bg-slate-900 overflow-hidden">
              <div className="bg-slate-800/50 px-3 py-1.5 border-b border-slate-800 flex items-center gap-2 select-none">
                <span className="text-blue-400 text-xs">📥</span>
                <span className="text-xs font-bold text-slate-300">stdin</span>
                <span className="text-[10px] text-slate-500 ml-auto">type your <code className="text-blue-400">input()</code> values, one per line · used by ▶ Run</span>
              </div>
              <textarea
                value={userStdin}
                onChange={(e) => setUserStdin(e.target.value)}
                placeholder={"5\nAlex\n100"}
                className="w-full bg-transparent text-blue-300 font-mono text-xs p-3 resize-none focus:outline-none leading-5 placeholder:text-slate-700"
                rows={3}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            {/* Action buttons: ← Hints | ▶ Run | ▶ Run Tests */}
            <div className="flex gap-2">
              <button
                onClick={() => setStage("design")}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors"
              >
                ← Hints
              </button>
              <button
                onClick={handleQuickRun}
                disabled={quickRunning || pyodideLoading}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  quickRunning || pyodideLoading
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-900/30"
                }`}
              >
                {quickRunning ? (
                  <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #78716c", borderTopColor: "#fbbf24", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                ) : "▶ Run"}
              </button>
              <button
                onClick={handleRunTests}
                disabled={running || pyodideLoading}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  running || pyodideLoading
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40"
                }`}
              >
                {running ? "⏳ Running tests…" : pyodideLoading ? "⏳ Loading…" : "▶ Run Tests"}
              </button>
            </div>

            {/* Output terminal */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col font-mono text-sm" style={{ minHeight: "10rem" }}>
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between select-none flex-shrink-0">
                <span className="text-xs text-slate-400 font-semibold">⬛ Output</span>
                <div className="flex items-center gap-3">
                  {userStdin.trim() && (
                    <span className="text-[10px] text-slate-600 font-mono">
                      stdin: <span className="text-blue-400">{userStdin.split("\n").filter(Boolean).slice(0, 4).join(", ")}</span>
                    </span>
                  )}
                  {quickRunOutput && (
                    <button onClick={() => setQuickRunOutput(null)} className="text-[10px] text-slate-600 hover:text-slate-400 font-semibold">
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto max-h-52">
                {!quickRunOutput && !quickRunning && (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-2 select-none opacity-60">
                    <span className="text-2xl">▶</span>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      <span className="text-amber-400 font-bold">▶ Run</span> — test with your stdin inputs<br />
                      <span className="text-green-400 font-bold">▶ Run Tests</span> — run all test cases
                    </p>
                  </div>
                )}
                {quickRunning && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid #475569", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Executing…
                  </div>
                )}
                {quickRunOutput && !quickRunning && (
                  quickRunOutput.error ? (
                    <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                      {"🚨 ERROR\n" + quickRunOutput.error + "\n\n=== Exited With Errors ==="}
                    </pre>
                  ) : (
                    <div>
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                        {quickRunOutput.stdout || "(no output — did you forget print()?)"}
                      </pre>
                      <p className="text-slate-600 text-[10px] mt-3 border-t border-slate-800 pt-2">=== Exited Successfully ===</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Runtime error from Run Tests */}
            {runtimeError && (
              <div className="rounded-lg border border-red-700/40 bg-red-900/20 px-4 py-3 text-xs font-mono text-red-300 whitespace-pre-wrap">
                🚨 {runtimeError}
              </div>
            )}

            {/* Reference program (after 3 failed attempts) */}
            {showRef && <ReferencePanel ref={program.referenceProgram!} />}
          </div>
        </div>
      </div>
    );
  };

  // ── Stage: TEST ───────────────────────────────────────────────────────────
  const renderTest = () => {
    const passed = testResults.filter((r) => r.passed).length;
    const total = testResults.length;
    const allPassed = passed === total;

    return (
      <div className="space-y-5">
        {/* Score summary */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-xl border border-slate-700 bg-slate-900">
          <ScoreRing score={score} />
          <div className="flex-1">
            <div className="text-2xl font-black text-white mb-1">
              {passed}/{total} tests passed
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full font-semibold ${allPassed ? "bg-green-500/20 text-green-400 border border-green-600/30" : "bg-red-500/20 text-red-400 border border-red-600/30"}`}>
                {allPassed ? "✅ All Passed" : `❌ ${total - passed} failing`}
              </span>
              {hintsRevealed > 0 && <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600/30">{hintsRevealed} hints used</span>}
              {failedAttempts > 0 && <span className="px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 border border-red-700/30">{failedAttempts} failed attempt{failedAttempts !== 1 ? "s" : ""}</span>}
            </div>
            {/* Adaptive decision message */}
            <div className="mt-2 text-sm">
              {allPassed && decision === "next_tier" && <span className="text-green-400 font-semibold">🚀 Excellent! Ready for the next tier.</span>}
              {allPassed && decision === "next_program" && <span className="text-blue-400 font-semibold">👍 Good work! Moving to the next program.</span>}
              {!allPassed && decision === "show_reference" && <span className="text-amber-400 font-semibold">💡 Study the reference, then try again.</span>}
              {!allPassed && decision !== "show_reference" && <span className="text-slate-400">Fix the failing tests and resubmit.</span>}
            </div>
          </div>
        </div>

        {/* Test results list */}
        <div className="space-y-2">
          {testResults.map((r) => <TestResultRow key={r.id} result={r} />)}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {!allPassed && (
            <button
              onClick={() => { setStage("code"); setRuntimeError(null); }}
              className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-bold text-sm transition-colors"
            >
              ← Fix & Retry
            </button>
          )}
          {allPassed && (
            <button
              onClick={() => setStage("reflect")}
              className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-lg shadow-indigo-900/40 active:scale-95"
            >
              Collect XP → Reflect 🌟
            </button>
          )}
          {/* Skip always advances — pass "next_program" so getNextProgram moves forward, not replays current */}
          <button
            onClick={() => onComplete({
              programId: program.id, score: 0, decision: "next_program", xpEarned: 0,
              hintsUsed: hintsRevealed, failedAttempts,
              testCasesPassed: testResults.filter(r => r.passed).length,
              totalTestCases: program.testCases.filter(t => !t.isHidden).length,
              secondsElapsed: Math.floor((Date.now() - startTime) / 1000),
            })}
            className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors"
          >
            Skip →
          </button>
        </div>
      </div>
    );
  };

  // ── Stage: REFLECT ────────────────────────────────────────────────────────
  const renderReflect = () => {
    const pct = Math.round(score * 100);
    const scoreColor = pct >= 80 ? "text-green-400" : pct >= 40 ? "text-yellow-400" : "text-red-400";

    return (
      <div className="space-y-5 text-center">
        {/* Trophy */}
        <div className="py-6">
          <div className="text-6xl mb-3">
            {pct >= 80 ? "🏆" : pct >= 40 ? "🎯" : "📘"}
          </div>
          <h2 className="text-2xl font-black text-white">{program.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{program.tagline}</p>
        </div>

        {/* XP award */}
        <div
          className={`rounded-2xl border p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/30 transition-all duration-700 ${
            xpAnimating ? "scale-100 opacity-100" : "scale-95 opacity-70"
          }`}
        >
          <div className={`text-5xl font-black ${xpAnimating ? scoreColor : "text-slate-500"} transition-all duration-700`}>
            +{xpEarned} XP
          </div>
          <div className="text-slate-400 text-sm mt-1">of {program.xpReward} possible</div>
        </div>

        {/* Score breakdown */}
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Score Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Base score</span><span className="font-mono">1.00</span>
            </div>
            {hintsRevealed > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Hints used ({hintsRevealed})</span><span className="font-mono">-{(hintsRevealed * 0.12).toFixed(2)}</span>
              </div>
            )}
            {failedAttempts > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Failed attempts ({failedAttempts})</span><span className="font-mono">-{(failedAttempts * 0.08).toFixed(2)}</span>
              </div>
            )}
            {secondsElapsed < 120 && (
              <div className="flex justify-between text-green-400">
                <span>Speed bonus (&lt;2 min)</span><span className="font-mono">+0.05</span>
              </div>
            )}
            <div className={`flex justify-between font-bold border-t border-slate-700 pt-2 mt-2 ${scoreColor}`}>
              <span>Final score</span><span className="font-mono">{score.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Concepts earned */}
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Concepts practised</h3>
          <div className="flex flex-wrap gap-2">
            {program.concepts.map((c) => (
              <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-green-900/30 border border-green-700/40 text-green-300 font-medium">
                ✓ {c}
              </span>
            ))}
          </div>
        </div>

        {/* Model solution — revealed only after the student has solved it */}
        {program.referenceProgram && (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              📖 Model Solution
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              You earned this. Compare your approach — there is always more than one right way.
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-800">
              <div className="bg-slate-950 px-3 py-1.5 flex items-center gap-1.5 border-b border-slate-800 select-none">
                <span className="text-[10px] text-slate-500 font-mono">🐍 reference.py</span>
              </div>
              <pre className="bg-slate-950 text-green-300 text-xs font-mono p-4 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {program.referenceProgram.code}
              </pre>
            </div>
            {program.referenceProgram.explanation && (
              <p className="text-xs text-slate-400 mt-3 leading-relaxed italic border-l-2 border-slate-700 pl-3">
                {program.referenceProgram.explanation}
              </p>
            )}
          </div>
        )}

        {/* Design challenge for hackathon tier */}
        {program.designChallenge && (
          <div className="rounded-xl border border-purple-700/30 bg-purple-900/10 p-4 text-left">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">🏆 Design Challenge</h3>
            <p className="text-sm text-purple-200">{program.designChallenge}</p>
          </div>
        )}

        {/* Next action */}
        <div className="pt-2">
          <div className="text-xs text-slate-500 mb-3 uppercase tracking-widest font-semibold">
            {decision === "next_tier" && "Ready to advance tier →"}
            {decision === "next_program" && "Next program in same tier →"}
            {decision === "show_reference" && "Review reference, then continue →"}
          </div>
          <button
            onClick={() => onComplete({
              programId: program.id,
              score,
              decision,
              xpEarned,
              hintsUsed: hintsRevealed,
              failedAttempts,
              testCasesPassed: testResults.filter(r => r.passed).length,
              totalTestCases: testResults.length,
              secondsElapsed,
            })}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg transition-all shadow-lg shadow-indigo-900/50 active:scale-95"
          >
            {decision === "next_tier" ? "Advance to next tier ⬆" : "Next Program →"}
          </button>
        </div>
      </div>
    );
  };

  // ── Root render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Top navigation */}
        <div className="flex items-center justify-between mb-4">
          {onExit ? (
            <button
              onClick={onExit}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              ← Back
            </button>
          ) : <div />}
          <TierBadge tier={program.tier} />
        </div>

        {/* Stage progress bar */}
        <StageBar current={stage} />

        {/* Stage content */}
        <div key={stage} className="animate-fadeIn">
          {stage === "understand" && renderUnderstand()}
          {stage === "design" && renderDesign()}
          {stage === "code" && renderCode()}
          {stage === "test" && renderTest()}
          {stage === "reflect" && renderReflect()}
        </div>
      </div>
    </div>
  );
}
