"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bot, MoveRight, Star, Code2, CheckCircle,
  Lock, Play, Zap, Terminal, Sparkles, BookOpen, Clock,
  Trophy, ChevronRight, Flame
} from "lucide-react";
import { getProgramsByChapter, CHAPTER_META } from "@/lib/yamunaProgramBank";
import { TIER_META, type ProgramTier } from "@/lib/yamunaProgramTypes";

const TIER_ORDER: ProgramTier[] = ["beginner","intermediate","advanced","leetcode","hackathon"];

interface YamunaCourseLesson {
  id: string; order: number; title: string; sutra: string;
  objective: string; durationMin: number; difficulty: number;
  status: "completed"|"current"|"available"|"locked";
  summary: string; outcomes: string[]; codePreview: string;
  startUrl: string; practiceUrl: string;
}

interface YamunaCoursePayload {
  course: {
    id: string; levelId: string; levelSlug: string; title: string;
    subtitle: string; tagline: string; completedLessons: number;
    totalLessons: number; progressPct: number; earnedXp: number; totalXpAvailable: number;
  };
  lessons: YamunaCourseLesson[];
  selectedLessonId: string;
}

export default function YamunaCourseClient({ payload }: { payload: YamunaCoursePayload }) {
  const [selectedId, setSelectedId] = useState<string>(payload.selectedLessonId);

  const selectedLesson = useMemo(
    () => payload.lessons.find((l) => l.id === selectedId) ?? payload.lessons[0],
    [payload.lessons, selectedId]
  );

  const chapterId = useMemo(
    () => selectedLesson.practiceUrl.split("/").pop() ?? "",
    [selectedLesson.practiceUrl]
  );

  const chapterPrograms = useMemo(() => getProgramsByChapter(chapterId), [chapterId]);
  const chapterMeta = useMemo(() => CHAPTER_META.find((c) => c.id === chapterId), [chapterId]);

  function statusDetails(status: "completed"|"current"|"available"|"locked") {
    switch (status) {
      case "completed": return { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", label: "Completed", icon: CheckCircle };
      case "current":   return { bg: "bg-amber-500/10 border-amber-500/30",    text: "text-amber-400",   label: "Active",    icon: Zap };
      case "available": return { bg: "bg-orange-500/10 border-orange-500/30",  text: "text-orange-400",  label: "Unlocked",  icon: Play };
      default:          return { bg: "bg-slate-800/50 border-slate-700/50",    text: "text-slate-500",   label: "Locked",    icon: Lock };
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="px-6 py-6 md:px-8 md:py-8 bg-slate-950/60 border-b border-slate-900 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <span className="text-2xl">☕</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Mission Dashboard
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                {payload.course.title}
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {payload.course.subtitle} — {payload.course.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-end">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-300">Level Progression</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {payload.course.completedLessons} of {payload.course.totalLessons} lessons mastered
              </div>
            </div>
            <div className="w-full sm:w-48">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-400">{payload.course.progressPct}% Mastered</span>
                <span className="text-slate-500">{payload.course.earnedXp} XP</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${payload.course.progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen size={14} /> Course Missions
            </span>
            <span className="text-xs font-bold text-amber-400 bg-amber-400/5 border border-amber-500/10 px-2 py-0.5 rounded-full">
              {payload.course.subtitle.split("—")[0].trim()}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {payload.lessons.map((lesson) => {
              const active = lesson.id === selectedId;
              const meta = statusDetails(lesson.status);
              const StatusIcon = meta.icon;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedId(lesson.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all duration-300 flex items-start gap-4 relative overflow-hidden group ${
                    active
                      ? "bg-slate-900 border-amber-500/40 shadow-xl shadow-amber-500/5"
                      : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/50 hover:border-slate-800"
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500" />
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    active
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-slate-900 text-slate-500 border border-slate-800"
                  }`}>
                    <span className="font-bold text-sm">{String(lesson.order).padStart(2,"0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        Mission {lesson.order}
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.bg} ${meta.text}`}>
                        <StatusIcon size={10} /> {meta.label}
                      </span>
                    </div>
                    <h3 className={`font-semibold truncate text-[15px] transition-colors ${
                      active ? "text-white" : "text-slate-300 group-hover:text-white"
                    }`}>
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={11}/> {lesson.durationMin}m</span>
                      <span>•</span>
                      <span>{lesson.sutra}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Detail Panel */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Mission Banner */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-12 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Active Mission
                  </span>
                  <span className="text-xs font-bold text-slate-500">{selectedLesson.sutra}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {selectedLesson.title}
                </h2>
                <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
                  {selectedLesson.objective}
                </p>
              </div>
              <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
                {selectedLesson.status !== "locked" ? (
                  <>
                    <Link
                      href={selectedLesson.startUrl}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider"
                    >
                      <Play size={16} fill="currentColor" /> Start Mission
                    </Link>
                    <Link
                      href={selectedLesson.practiceUrl}
                      className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-extrabold hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider"
                    >
                      <Code2 size={16} /> Practice
                    </Link>
                  </>
                ) : (
                  <button disabled className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-extrabold text-sm uppercase tracking-wider cursor-not-allowed">
                    <Lock size={16} /> Mission Locked
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Code Preview + Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Java Code Preview */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col h-[340px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Terminal size={14} className="text-amber-400" /> Java Code Preview
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </span>
              </div>
              <div className="bg-[#030712] rounded-2xl p-4 flex-1 font-mono text-sm overflow-hidden relative border border-slate-900">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                <pre className="text-amber-400/90 whitespace-pre-wrap select-all selection:bg-amber-500/20 text-xs leading-relaxed">
                  <code>{selectedLesson.codePreview}</code>
                </pre>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium font-mono">
                <span>Main.java · Java 17</span>
                <span className="text-amber-400 flex items-center gap-1"><Sparkles size={12}/> Target Code</span>
              </div>
            </div>

            {/* Outcomes */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" /> What you will build
                </h3>
                <p className="text-slate-300 text-[13px] leading-relaxed mb-4">{selectedLesson.summary}</p>
                <ul className="space-y-2">
                  {selectedLesson.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-slate-300">
                      <CheckCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Duration", value: `${selectedLesson.durationMin}m`, icon: Clock },
                  { label: "Difficulty", value: `${selectedLesson.difficulty}/4`, icon: Flame },
                  { label: "XP Reward", value: "100 XP", icon: Star },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-slate-900/60 rounded-xl p-3">
                    <Icon size={14} className="text-amber-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-white">{value}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Lab */}
          {chapterPrograms.length > 0 && (
            <div className="bg-slate-950 border border-slate-800/60 rounded-3xl overflow-hidden">
              {/* Lab Header */}
              <div className="px-6 py-5 border-b border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      ☕ Practice Lab · Live Streams
                    </span>
                  </div>
                  <h3 className="font-black text-white text-lg">
                    {chapterMeta?.programCount ?? 15} Coding Challenges — 5 Difficulty Tiers
                  </h3>
                </div>
                <Link
                  href={selectedLesson.practiceUrl}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
                >
                  Open Lab <ChevronRight size={14}/>
                </Link>
              </div>

              {/* Tier Rows */}
              {TIER_ORDER.map((tier) => {
                const meta = TIER_META[tier];
                const tierPrograms = chapterPrograms.filter((p) => p.tier === tier);
                if (tierPrograms.length === 0) return null;
                const totalXp = tierPrograms.reduce((s, p) => s + p.xpReward, 0);
                return (
                  <div key={tier} className="border-b border-slate-800/40 last:border-b-0">
                    {/* Tier label */}
                    <div
                      className="px-6 py-3 flex items-center gap-3"
                      style={{ background: meta.color + "08" }}
                    >
                      <span className="text-base">{meta.emoji}</span>
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
                        {meta.label} Tier
                      </span>
                      <span className="text-[10px] text-slate-600 ml-auto">
                        {tierPrograms.length} programs · +{totalXp} XP
                      </span>
                    </div>
                    {/* Program Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/40">
                      {tierPrograms.map((prog, idx) => (
                        <Link
                          href={`${selectedLesson.practiceUrl}?programId=${prog.id}`}
                          key={prog.id}
                          className="px-4 py-4 flex flex-col gap-2.5 hover:bg-slate-900/60 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{prog.emoji}</span>
                              <span className="text-[10px] text-slate-600 font-bold">#{idx + 1}</span>
                            </div>
                            <span
                              className="text-[10px] font-black px-2 py-0.5 rounded-full"
                              style={{ background: meta.color + "20", color: meta.color, border: `1px solid ${meta.color}40` }}
                            >
                              +{prog.xpReward} XP
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-snug">
                              {prog.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{prog.tagline}</div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 mt-auto">
                            {prog.concepts.slice(0, 2).map((c) => (
                              <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700/60 font-mono">
                                {c}
                              </span>
                            ))}
                            <span className="text-[10px] text-slate-600 ml-auto flex items-center gap-1">
                              <Clock size={9}/> {prog.estimatedMinutes}m
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Footer CTA */}
              <div className="px-6 py-4 bg-gradient-to-r from-amber-950/30 to-slate-950/60 flex items-center justify-between gap-4 border-t border-slate-800/40">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Trophy size={13} className="text-amber-400"/>
                  <span>Complete all 5 tiers to earn the <span className="text-amber-400 font-bold">{chapterMeta?.title ?? ""} Master</span> badge</span>
                </div>
                <Link
                  href={selectedLesson.practiceUrl}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Start Beginner <ChevronRight size={13}/>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
