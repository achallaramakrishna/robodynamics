"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { 
  Bot, MoveRight, Star, Code2, CheckCircle, 
  Lock, Play, Zap, Terminal, Sparkles, BookOpen, Clock, ShieldAlert 
} from "lucide-react";

interface VidyaCourseLesson {
  id: string;
  order: number;
  title: string;
  sutra: string;
  objective: string;
  durationMin: number;
  difficulty: number;
  status: "completed" | "current" | "available" | "locked";
  summary: string;
  outcomes: string[];
  codePreview: string;
  startUrl: string;
}

interface VidyaCoursePayload {
  course: {
    id: string;
    levelId: string;
    levelSlug: string;
    title: string;
    subtitle: string;
    tagline: string;
    completedLessons: number;
    totalLessons: number;
    progressPct: number;
    earnedXp: number;
    totalXpAvailable: number;
  };
  lessons: VidyaCourseLesson[];
  selectedLessonId: string;
}

export default function VidyaCourseClient({ payload }: { payload: VidyaCoursePayload }) {
  const [selectedId, setSelectedId] = useState<string>(payload.selectedLessonId);
  const [viewportWidth, setViewportWidth] = useState(1280);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const selectedLesson = useMemo(
    () => payload.lessons.find((l) => l.id === selectedId) ?? payload.lessons[0],
    [payload.lessons, selectedId]
  );

  const isTabletOrSmaller = viewportWidth < 1024;
  const isPhone = viewportWidth < 720;

  function statusDetails(status: "completed" | "current" | "available" | "locked") {
    switch (status) {
      case "completed":
        return { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", label: "Completed", icon: CheckCircle };
      case "current":
        return { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400", label: "Active", icon: Zap };
      case "available":
        return { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-400", label: "Unlocked", icon: Play };
      case "locked":
        default:
          return { bg: "bg-slate-800/50 border-slate-700/50", text: "text-slate-500", label: "Locked", icon: Lock };
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Dynamic Sci-fi Brand Header */}
      <header className="px-6 py-6 md:px-8 md:py-8 bg-slate-950/60 border-b border-slate-900 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Bot size={28} className="text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Mission Dashboard
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
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
                <span className="text-indigo-400">{payload.course.progressPct}% Mastered</span>
                <span className="text-slate-500">{payload.course.earnedXp} XP</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${payload.course.progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Lesson List */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen size={14} /> Course Missions
            </span>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-400/5 border border-indigo-500/10 px-2 py-0.5 rounded-full">
              Level 1 Foundations
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
                      ? "bg-slate-900 border-indigo-500/40 shadow-xl shadow-indigo-500/5" 
                      : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/50 hover:border-slate-800"
                  }`}
                >
                  {/* Active Highlight Line */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500" />
                  )}

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    active 
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                      : "bg-slate-900 text-slate-500 border border-slate-800"
                  }`}>
                    <span className="font-bold text-sm">0{lesson.order}</span>
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
                      <span className="flex items-center gap-1"><Clock size={11} /> {lesson.durationMin}m</span>
                      <span>•</span>
                      <span>{lesson.sutra}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Selected Mission Panel */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Mission Main Banner */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            {/* Background decorative gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                    Active Mission Payload
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {selectedLesson.sutra}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {selectedLesson.title}
                </h2>
                <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
                  {selectedLesson.objective}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {selectedLesson.status !== "locked" ? (
                  <Link 
                    href={selectedLesson.startUrl}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider"
                  >
                    <Play size={16} fill="currentColor" /> Start Mission
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-extrabold text-sm uppercase tracking-wider cursor-not-allowed"
                  >
                    <Lock size={16} /> Mission Locked
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details & Live Sandbox Simulator Code Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Interactive Code Preview Terminal */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col h-[340px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Terminal size={14} className="text-indigo-400" /> Python Sandbox Preview
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </span>
              </div>

              <div className="bg-[#030712] rounded-2xl p-4 flex-1 font-mono text-sm overflow-hidden relative border border-slate-900">
                {/* Micro reflection shimmer */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                <pre className="text-emerald-400/90 whitespace-pre-wrap select-all selection:bg-emerald-500/20">
                  <code>{selectedLesson.codePreview}</code>
                </pre>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium font-mono">
                <span>UTF-8 · Interactive Sandbox</span>
                <span className="text-indigo-400 flex items-center gap-1">
                  <Sparkles size={12} /> Target Code
                </span>
              </div>
            </div>

            {/* Right: Outcomes & Mission Meta */}
            <div className="flex flex-col gap-6">
              {/* Outcomes card */}
              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-400" /> What this Mission Builds
                </h3>
                <p className="text-slate-300 text-[13px] leading-relaxed mb-4">
                  {selectedLesson.summary}
                </p>
                <div className="space-y-3">
                  {selectedLesson.outcomes.map((item, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs text-slate-400 leading-relaxed">
                      <span className="text-indigo-400 font-black text-sm shrink-0 leading-none">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta stats list */}
              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 grid grid-cols-3 gap-4">
                <div className="text-center py-2 bg-slate-900/30 border border-slate-900/40 rounded-2xl">
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Duration</div>
                  <div className="text-sm font-bold text-slate-200 mt-1 flex items-center justify-center gap-1">
                    <Clock size={13} className="text-blue-400" /> {selectedLesson.durationMin} min
                  </div>
                </div>
                <div className="text-center py-2 bg-slate-900/30 border border-slate-900/40 rounded-2xl">
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Difficulty</div>
                  <div className="text-sm font-bold text-slate-200 mt-1 flex items-center justify-center gap-1">
                    <Star size={13} fill="currentColor" className="text-amber-400" /> {selectedLesson.difficulty}/5
                  </div>
                </div>
                <div className="text-center py-2 bg-slate-900/30 border border-slate-900/40 rounded-2xl">
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Rank Reward</div>
                  <div className="text-sm font-bold text-slate-200 mt-1 flex items-center justify-center gap-1">
                    <Zap size={13} className="text-indigo-400" /> +{selectedLesson.id.includes("SETUP") ? 100 : selectedLesson.id.includes("LOGIC") ? 120 : 150} XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
