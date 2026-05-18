"use client";

/**
 * YamunaPracticeClient — adaptive Java program practice session for one chapter
 *
 * Session resume flow:
 * 1. On mount: GET /api/yamuna/program-progress?chapterId=<id>
 *    → Returns already-solved program IDs + scores from DB
 * 2. Client finds first unsolved program in tier/tierIndex order
 * 3. On each completion: POST /api/yamuna/program-progress
 * 4. getNextProgram() drives adaptive routing between programs
 * 5. Chapter complete → summary screen
 *
 * ?programId= query param lets the course map jump directly to a specific program.
 * Degradation: if API is unreachable, practice still works (starts fresh, no save).
 */

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import YamunaProblemEngine from "../../../../components/yamuna/YamunaProblemEngine";
import {
  getProgramsByChapter,
  getNextProgram,
  CHAPTER_META,
} from "../../../../lib/yamunaProgramBank";
import { TIER_META } from "../../../../lib/yamunaProgramTypes";
import type { YamunaProgram, ProgramTier } from "../../../../lib/yamunaProgramTypes";
import type { ProgramProgressPostBody } from "../../../api/yamuna/program-progress/route";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompletedEntry {
  programId: string;
  title: string;
  tier: ProgramTier;
  score: number;
  xpEarned: number;
}

interface ChapterProgressResponse {
  completedProgramIds: string[];
  programScores: Record<string, number>;
  totalXp: number;
  programsSolved: number;
}

interface Props {
  chapterId: string;
}

// ─── Tier ordering ────────────────────────────────────────────────────────────

const TIER_ORDER: ProgramTier[] = [
  "beginner",
  "intermediate",
  "advanced",
  "leetcode",
  "hackathon",
];

function resolveResumeProgram(
  programs: YamunaProgram[],
  solvedIds: Set<string>
): YamunaProgram | null {
  for (const tier of TIER_ORDER) {
    for (let idx = 0; idx <= 2; idx++) {
      const prog = programs.find((p) => p.tier === tier && p.tierIndex === idx);
      if (prog && !solvedIds.has(prog.id)) return prog;
    }
  }
  return null;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchChapterProgress(
  chapterId: string
): Promise<ChapterProgressResponse | null> {
  try {
    const res = await fetch(
      `/api/yamuna/program-progress?chapterId=${encodeURIComponent(chapterId)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function postProgramCompletion(
  body: ProgramProgressPostBody
): Promise<{ newXp?: number; chapterXp?: number } | null> {
  try {
    const res = await fetch("/api/yamuna/program-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Chapter complete screen ──────────────────────────────────────────────────

function ChapterCompleteScreen({
  chapterId,
  completed,
  totalXp,
  programsTotal,
  onContinue,
}: {
  chapterId: string;
  completed: CompletedEntry[];
  totalXp: number;
  programsTotal: number;
  onContinue: () => void;
}) {
  const meta = CHAPTER_META.find((c) => c.id === chapterId);

  const tierCounts = completed.reduce<Record<string, number>>((acc, e) => {
    acc[e.tier] = (acc[e.tier] ?? 0) + 1;
    return acc;
  }, {});

  const avgScore =
    completed.length > 0
      ? Math.round((completed.reduce((s, e) => s + e.score, 0) / completed.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6 text-center animate-fadeIn">
        <div className="text-7xl mb-2">🏆</div>
        <h1 className="text-3xl font-black text-white">Chapter Complete!</h1>
        <p className="text-slate-400 text-lg">
          {meta?.emoji} {meta?.title}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-700/30 p-5">
            <div className="text-4xl font-black text-amber-400">+{totalXp}</div>
            <div className="text-slate-400 text-xs mt-1 font-semibold uppercase tracking-widest">XP Earned</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/30 p-5">
            <div className="text-4xl font-black text-green-400">{avgScore}%</div>
            <div className="text-slate-400 text-xs mt-1 font-semibold uppercase tracking-widest">Avg Score</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Tiers cleared
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {TIER_ORDER.map((tier) => {
              const m = TIER_META[tier];
              const count = tierCounts[tier] ?? 0;
              const full = count >= 3;
              return (
                <div
                  key={tier}
                  className={`rounded-lg p-2 text-center border transition-all ${
                    full
                      ? "border-green-600/40 bg-green-900/20"
                      : count > 0
                      ? "border-slate-600 bg-slate-800"
                      : "border-slate-800 bg-slate-900 opacity-40"
                  }`}
                >
                  <div className="text-lg">{full ? "✅" : m.emoji}</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{count}/3</div>
                  <div className="text-[9px] text-slate-600 mt-0.5">{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            All programs ({completed.length}/{programsTotal})
          </h3>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {completed.map((e) => {
              const tm = TIER_META[e.tier];
              return (
                <div key={e.programId} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 truncate max-w-[200px]">
                    <span style={{ color: tm.color }}>{tm.emoji}</span>
                    {e.title}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono font-bold ${
                        e.score >= 0.8 ? "text-green-400" : e.score >= 0.4 ? "text-yellow-400" : "text-red-400"
                      }`}
                    >
                      {Math.round(e.score * 100)}%
                    </span>
                    <span className="text-amber-400 font-semibold w-12 text-right">+{e.xpEarned}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-lg transition-all shadow-lg shadow-orange-900/50 active:scale-95"
        >
          Back to Course Map →
        </button>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSession() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest animate-pulse">
        Loading Java practice session…
      </p>
    </div>
  );
}

// ─── Main client ──────────────────────────────────────────────────────────────

export default function YamunaPracticeClient({ chapterId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedProgramId = searchParams.get("programId");
  const programs = getProgramsByChapter(chapterId);
  const chapterMeta = CHAPTER_META.find((c) => c.id === chapterId);

  type SessionState = "loading" | "ready" | "done" | "empty";
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const [currentProgram, setCurrentProgram] = useState<YamunaProgram | null>(null);
  const [completed, setCompleted] = useState<CompletedEntry[]>([]);
  const [totalXp, setTotalXp] = useState(0);

  // ── Mount: load persisted progress, resolve resume point ──────────────────
  useEffect(() => {
    if (programs.length === 0) {
      setSessionState("empty");
      return;
    }

    let cancelled = false;

    (async () => {
      const progress = await fetchChapterProgress(chapterId);
      if (cancelled) return;

      if (progress) {
        const solved = new Set(progress.completedProgramIds);

        const completedEntries: CompletedEntry[] = programs
          .filter((p) => solved.has(p.id))
          .map((p) => ({
            programId: p.id,
            title: p.title,
            tier: p.tier,
            score: progress.programScores[p.id] ?? 0,
            xpEarned: 0,
          }));

        setCompleted(completedEntries);
        setTotalXp(progress.totalXp);

        if (solved.size >= programs.length) {
          setSessionState("done");
          return;
        }

        const jumpTarget = requestedProgramId
          ? programs.find((p) => p.id === requestedProgramId) ?? null
          : null;
        setCurrentProgram(jumpTarget ?? resolveResumeProgram(programs, solved));
      } else {
        const jumpTarget = requestedProgramId
          ? programs.find((p) => p.id === requestedProgramId) ?? null
          : null;
        setCurrentProgram(
          jumpTarget ?? programs.find((p) => p.tier === "beginner" && p.tierIndex === 0) ?? null
        );
      }

      setSessionState("ready");
    })();

    return () => { cancelled = true; };
  }, [chapterId, programs, requestedProgramId]);

  // ── Handle program completion ─────────────────────────────────────────────
  const handleComplete = useCallback(
    async ({
      programId,
      score,
      decision,
      xpEarned,
      hintsUsed = 0,
      failedAttempts = 0,
      testCasesPassed = 0,
      totalTestCases = 0,
      secondsElapsed = 0,
    }: {
      programId: string;
      score: number;
      decision: "next_tier" | "next_program" | "show_reference";
      xpEarned: number;
      hintsUsed?: number;
      failedAttempts?: number;
      testCasesPassed?: number;
      totalTestCases?: number;
      secondsElapsed?: number;
    }) => {
      const prog = programs.find((p) => p.id === programId);
      if (!prog) return;

      setCompleted((prev) => [
        ...prev.filter((e) => e.programId !== programId),
        { programId, title: prog.title, tier: prog.tier, score, xpEarned },
      ]);
      setTotalXp((prev) => prev + xpEarned);

      const next = getNextProgram(chapterId, prog.tier, prog.tierIndex, decision);
      if (next) {
        setCurrentProgram(next);
      } else {
        setSessionState("done");
      }

      await postProgramCompletion({
        programId,
        chapterId,
        tier: prog.tier,
        tierIndex: prog.tierIndex,
        score,
        xpEarned,
        hintsUsed,
        failedAttempts,
        testCasesPassed,
        totalTestCases,
        secondsElapsed,
        solved: score > 0 && testCasesPassed === totalTestCases,
      });
    },
    [chapterId, programs]
  );

  // ── Render states ─────────────────────────────────────────────────────────

  if (sessionState === "empty") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">☕</div>
          <p className="text-slate-400">
            No programs found for{" "}
            <code className="text-amber-400">{chapterId}</code>.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl bg-amber-600 text-white font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (sessionState === "loading") return <LoadingSession />;

  if (sessionState === "done") {
    return (
      <ChapterCompleteScreen
        chapterId={chapterId}
        completed={completed}
        totalXp={totalXp}
        programsTotal={programs.length}
        onContinue={() => router.push("/yamuna/level-1")}
      />
    );
  }

  if (!currentProgram) return <LoadingSession />;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sticky chapter context strip */}
      <div className="bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/yamuna/level-1")}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            ← Course
          </button>
          <span className="text-slate-700">|</span>
          <span className="text-sm font-semibold text-slate-200">
            {chapterMeta?.emoji} {chapterMeta?.title ?? chapterId}
          </span>
          <span className="hidden sm:inline text-xs text-slate-600">
            — {currentProgram.tier} tier
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500">
            {completed.filter((e) => e.xpEarned > 0 || e.score > 0).length}
            <span className="text-slate-700">/{programs.length}</span>
          </span>
          <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold px-2 py-0.5 rounded-full">
            +{totalXp} XP
          </span>
        </div>
      </div>

      {/* Problem engine — key= forces full remount on program change */}
      <YamunaProblemEngine
        key={currentProgram.id}
        program={currentProgram}
        onComplete={handleComplete}
        onExit={() => router.push("/yamuna/level-1")}
      />
    </div>
  );
}
