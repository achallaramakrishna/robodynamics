import Link from "next/link";
import { MoveRight, Code2, Bot, Star } from "lucide-react";

export default function VidyaLevelPage({ params }: { params: { level: string } }) {
  const levelTitle = params.level === "level-1" ? "Level 1: The Python Sandbox" : `Level: ${params.level}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="px-8 py-10 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
              Vidya Academy
            </h1>
            <p className="text-slate-400 text-lg">
              {levelTitle} — Master the syntax. Control the machine.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot size={32} className="text-white" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Star className="text-amber-400" /> Current Missions
        </h2>

        <div className="grid gap-6">
          {/* Mission 1 */}
          <Link
            href="/vidya/lesson/PY_L1_01_SETUP"
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/80 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                  <span className="font-bold">01</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 group-hover:text-white transition-colors">
                    Welcome to the Python Adventure
                  </h3>
                  <p className="text-slate-500 mt-1">First contact with standard I/O and syntax rules.</p>
                </div>
              </div>
              <MoveRight className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
            </div>
          </Link>

          {/* Mission 4 */}
          <Link
            href="/vidya/lesson/PY_L1_04_LOGIC"
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/80 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                  <span className="font-bold">04</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 group-hover:text-white transition-colors">
                    Dynamic Decisions
                  </h3>
                  <p className="text-slate-500 mt-1">Master logical operators and AST structural execution.</p>
                </div>
              </div>
              <MoveRight className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
            </div>
          </Link>
          
          <div className="mt-8 p-6 rounded-2xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
            <Code2 className="mr-2" size={18} /> More missions will unlock as your Master Rank increases.
          </div>
        </div>
      </main>
    </div>
  );
}
