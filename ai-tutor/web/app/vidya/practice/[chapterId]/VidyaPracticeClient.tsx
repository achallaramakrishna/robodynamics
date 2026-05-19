"use client";

/**
 * VidyaPracticeClient — adaptive program practice session for one chapter
 *
 * Session resume flow (production):
 * 1. On mount: GET /api/vidya/program-progress?chapterId=<id>
 *    → Returns already-solved program IDs + scores from DB
 * 2. Client finds first unsolved program in tier/tierIndex order — starts there
 * 3. On each completion: POST /api/vidya/program-progress
 *    → DB upsert (keeps best score) + XP added to session cookie
 * 4. getNextProgram() drives adaptive routing between programs
 * 5. Chapter complete → summary screen with full leaderboard
 *
 * Degradation: if API is unreachable, practise still works (starts fresh, no save).
 */

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VidyaProblemEngine from "../../../../components/vidya/VidyaProblemEngine";
import {
  getProgramsByChapter,
  getNextProgram,
  CHAPTER_META,
} from "../../../../lib/vidyaProgramBank";
import { TIER_META } from "../../../../lib/vidyaProgramTypes";
import type { VidyaProgram, ProgramTier } from "../../../../lib/vidyaProgramTypes";
import type { ProgramProgressPostBody } from "../../../api/vidya/program-progress/route";

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

// ─── Tier/index ordering for resume resolution ────────────────────────────────

const TIER_ORDER: ProgramTier[] = [
  "beginner",
  "intermediate",
  "advanced",
  "leetcode",
  "hackathon",
];

/**
 * Given a set of already-solved program IDs, find the first unsolved program
 * in ascending tier → tierIndex order for the chapter.
 * Returns null if all 15 programs are solved (chapter done).
 */
function resolveResumeProgram(
  programs: VidyaProgram[],
  solvedIds: Set<string>
): VidyaProgram | null {
  for (const tier of TIER_ORDER) {
    for (let idx = 0; idx <= 2; idx++) {
      const prog = programs.find((p) => p.tier === tier && p.tierIndex === idx);
      if (prog && !solvedIds.has(prog.id)) return prog;
    }
  }
  return null; // all solved
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchChapterProgress(
  chapterId: string
): Promise<ChapterProgressResponse | null> {
  try {
    const res = await fetch(
      `/api/vidya/program-progress?chapterId=${encodeURIComponent(chapterId)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

interface NewBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

async function postProgramCompletion(
  body: ProgramProgressPostBody
): Promise<{ newXp?: number; chapterXp?: number; newBadges?: NewBadge[] } | null> {
  try {
    const res = await fetch("/api/vidya/program-progress", {
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

        {/* XP + avg score */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-700/30 p-5">
            <div className="text-4xl font-black text-indigo-400">+{totalXp}</div>
            <div className="text-slate-400 text-xs mt-1 font-semibold uppercase tracking-widest">XP Earned</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/30 p-5">
            <div className="text-4xl font-black text-green-400">{avgScore}%</div>
            <div className="text-slate-400 text-xs mt-1 font-semibold uppercase tracking-widest">Avg Score</div>
          </div>
        </div>

        {/* Tier completion grid */}
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

        {/* Score breakdown */}
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
                    <span className="text-indigo-400 font-semibold w-12 text-right">+{e.xpEarned}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg transition-all shadow-lg shadow-indigo-900/50 active:scale-95"
        >
          Back to Course Map →
        </button>
      </div>
    </div>
  );
}

// ─── Badge celebration toast ──────────────────────────────────────────────────

/**
 * Stacked badge toasts — each auto-dismisses after 4 seconds.
 * The dismissBadge callback removes one badge by index from the queue.
 */
function BadgeCelebrationToast({
  badges,
  onDismiss,
}: {
  badges: NewBadge[];
  onDismiss: (index: number) => void;
}) {
  // Auto-dismiss the first badge in the queue after 4 s
  React.useEffect(() => {
    if (badges.length === 0) return;
    const t = setTimeout(() => onDismiss(0), 4000);
    return () => clearTimeout(t);
  }, [badges, onDismiss]);

  if (badges.length === 0) return null;

  // Show only the first badge at a time
  const badge = badges[0];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        right: 20,
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          border: "1.5px solid rgba(167,139,250,0.5)",
          borderRadius: 14,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 8px 32px rgba(99,102,241,0.35), 0 2px 8px rgba(0,0,0,0.4)",
          animation: "badge-slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          minWidth: 260,
          maxWidth: 320,
          pointerEvents: "auto",
        }}
        onClick={() => onDismiss(0)}
      >
        {/* Glow pulse */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(167,139,250,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            flexShrink: 0,
            animation: "badge-pulse 1.2s ease-in-out infinite",
          }}
        >
          {badge.emoji}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              color: "#a78bfa",
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            🏅 Badge Unlocked!
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9" }}>
            {badge.name}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, lineHeight: 1.4 }}>
            {badge.description}
          </div>
        </div>

        {badges.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "#6366f1",
              color: "#fff",
              borderRadius: "50%",
              width: 20,
              height: 20,
              fontSize: 10,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {badges.length}
          </div>
        )}
      </div>

      <style>{`
        @keyframes badge-slide-in {
          from { opacity: 0; transform: translateX(40px) scale(0.9); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(167,139,250,0); }
        }
      `}</style>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSession() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest animate-pulse">
        Loading practice session…
      </p>
    </div>
  );
}

// ─── Main client ──────────────────────────────────────────────────────────────

export default function VidyaPracticeClient({ chapterId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedProgramId = searchParams.get("programId");
  const programs = getProgramsByChapter(chapterId);
  const chapterMeta = CHAPTER_META.find((c) => c.id === chapterId);

  // ── Session state ──
  type SessionState = "loading" | "ready" | "done" | "empty";
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const [currentProgram, setCurrentProgram] = useState<VidyaProgram | null>(null);
  const [completed, setCompleted] = useState<CompletedEntry[]>([]);
  const [totalXp, setTotalXp] = useState(0);

  // ── Badge toast queue ──
  const [badgeToasts, setBadgeToasts] = useState<NewBadge[]>([]);
  const dismissBadge = useCallback((index: number) => {
    setBadgeToasts((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
        // Reconstruct completed[] from DB records for the summary screen
        const solved = new Set(progress.completedProgramIds);

        const completedEntries: CompletedEntry[] = programs
          .filter((p) => solved.has(p.id))
          .map((p) => ({
            programId: p.id,
            title: p.title,
            tier: p.tier,
            score: progress.programScores[p.id] ?? 0,
            xpEarned: 0, // we'll recompute from totalXp on complete screen
          }));

        setCompleted(completedEntries);
        setTotalXp(progress.totalXp);

        if (solved.size >= programs.length) {
          // All 15 programs already solved — show chapter done
          setSessionState("done");
          return;
        }

        // If a specific program was requested via ?programId=, jump directly to it.
        // Otherwise fall back to the normal resume-from-first-unsolved logic.
        const jumpTarget = requestedProgramId
          ? programs.find((p) => p.id === requestedProgramId) ?? null
          : null;
        setCurrentProgram(jumpTarget ?? resolveResumeProgram(programs, solved));
      } else {
        // No DB record or error — honour ?programId= if present, otherwise start at beginner/0.
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

      // Optimistic local update (immediate — does not wait for API)
      setCompleted((prev) => [
        ...prev.filter((e) => e.programId !== programId),
        { programId, title: prog.title, tier: prog.tier, score, xpEarned },
      ]);
      setTotalXp((prev) => prev + xpEarned);

      // Adaptive routing (immediate)
      const next = getNextProgram(chapterId, prog.tier, prog.tierIndex, decision);
      if (next) {
        setCurrentProgram(next);
      } else {
        setSessionState("done");
      }

      // Persist to DB + check for newly awarded badges (background)
      const result = await postProgramCompletion({
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

      if (result?.newBadges && result.newBadges.length > 0) {
        setBadgeToasts((prev) => [...prev, ...result.newBadges!]);
      }
    },
    [chapterId, programs]
  );

  // ── Render states ─────────────────────────────────────────────────────────

  if (sessionState === "empty") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔍</div>
          <p className="text-slate-400">
            No programs found for{" "}
            <code className="text-indigo-400">{chapterId}</code>.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold"
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
        onContinue={() => router.push("/vidya/level-1")}
      />
    );
  }

  if (!currentProgram) return <LoadingSession />;

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Slim progress strip — chapter name + solved/XP */}
      <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-1.5 flex items-center justify-between z-40">
        <span className="text-xs font-semibold text-slate-300">
          {chapterMeta?.emoji} {chapterMeta?.title ?? chapterId}
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500">
            {completed.filter((e) => e.xpEarned > 0 || e.score > 0).length}
            <span className="text-slate-700">/{programs.length}</span>
            <span className="text-slate-600"> solved</span>
          </span>
          <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-bold px-2 py-0.5 rounded-full">
            +{totalXp} XP
          </span>
        </div>
      </div>

      {/* Problem engine — fills all remaining height */}
      <div className="flex-1 min-h-0">
        <VidyaProblemEngine
          key={currentProgram.id}
          program={currentProgram}
          onComplete={handleComplete}
          onExit={() => router.push("/vidya/level-1")}
        />
      </div>

      {/* Badge celebration toast overlay */}
      <BadgeCelebrationToast badges={badgeToasts} onDismiss={dismissBadge} />
    </div>
  );
}
