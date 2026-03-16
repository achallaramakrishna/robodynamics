import sys

path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx"
with open(path, encoding="utf-8") as f:
    src = f.read()

changes = []

# ── FIX 1A: Add audioCtxRef + audioSourceRef ─────────────────────────────────
old1 = "  const activeAudioRef = useRef<HTMLAudioElement | null>(null);\n  const audioUnlockedRef = useRef(false);"
new1 = (
    "  const activeAudioRef = useRef<HTMLAudioElement | null>(null);\n"
    "  const audioCtxRef    = useRef<AudioContext | null>(null);          // shared ctx — iOS safe\n"
    "  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null); // current playing node\n"
    "  const audioUnlockedRef = useRef(false);"
)
if old1 in src:
    src = src.replace(old1, new1, 1)
    changes.append("FIX 1A: added audioCtxRef + audioSourceRef")
else:
    changes.append("FIX 1A MISSED")

# ── FIX 1B: stopVoicePlayback — also stop AudioBufferSourceNode ──────────────
old2 = (
    "    if (activeAudioRef.current) {\n"
    "      activeAudioRef.current.onplaying = null;\n"
    "      activeAudioRef.current.onended = null;\n"
    "      activeAudioRef.current.onerror = null;\n"
    "      activeAudioRef.current.pause();\n"
    "      activeAudioRef.current.currentTime = 0;\n"
    "      activeAudioRef.current = null;"
)
new2 = (
    "    if (audioSourceRef.current) {\n"
    "      try { audioSourceRef.current.stop(); } catch { /* already stopped */ }\n"
    "      audioSourceRef.current = null;\n"
    "    }\n"
    "    if (activeAudioRef.current) {\n"
    "      activeAudioRef.current.onplaying = null;\n"
    "      activeAudioRef.current.onended = null;\n"
    "      activeAudioRef.current.onerror = null;\n"
    "      activeAudioRef.current.pause();\n"
    "      activeAudioRef.current.currentTime = 0;\n"
    "      activeAudioRef.current = null;"
)
if old2 in src:
    src = src.replace(old2, new2, 1)
    changes.append("FIX 1B: stopVoicePlayback stops AudioBufferSourceNode")
else:
    changes.append("FIX 1B MISSED")

# ── FIX 1C: unlockAudio — store AudioContext in ref ──────────────────────────
old3 = (
    "    try {\n"
    "      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;\n"
    "      if (AudioCtx) {\n"
    "        const ctx = new AudioCtx() as AudioContext;\n"
    "        const buf = ctx.createBuffer(1, 1, 22050);\n"
    "        const src = ctx.createBufferSource();\n"
    "        src.buffer = buf;\n"
    "        src.connect(ctx.destination);\n"
    "        src.start(0);\n"
    "        void ctx.resume();\n"
    "      }\n"
    "      // Also prime HTMLAudioElement path with a silent data URL\n"
    "      const sil = new Audio(\"data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=\");\n"
    "      void sil.play().catch(() => {});"
)
new3 = (
    "    try {\n"
    "      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;\n"
    "      if (AudioCtx) {\n"
    "        // Create once, store in ref — iOS Safari requires the SAME context for all playback\n"
    "        if (!audioCtxRef.current) {\n"
    "          audioCtxRef.current = new AudioCtx() as AudioContext;\n"
    "        }\n"
    "        const ctx = audioCtxRef.current;\n"
    "        void ctx.resume();\n"
    "        const buf = ctx.createBuffer(1, 1, 22050);\n"
    "        const src2 = ctx.createBufferSource();\n"
    "        src2.buffer = buf;\n"
    "        src2.connect(ctx.destination);\n"
    "        src2.start(0);\n"
    "      }\n"
    "      // Also prime HTMLAudioElement path with a silent data URL\n"
    "      const sil = new Audio(\"data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=\");\n"
    "      void sil.play().catch(() => {});"
)
if old3 in src:
    src = src.replace(old3, new3, 1)
    changes.append("FIX 1C: unlockAudio stores AudioContext in ref")
else:
    changes.append("FIX 1C MISSED")

# ── FIX 1D: speak() — replace new Audio() with AudioContext.decodeAudioData() ─
old4 = (
    "        const mimeType = String(ttsData.mimeType || \"audio/wav\");\n"
    "        const audio = new Audio(`data:${mimeType};base64,${ttsData.audioBase64}`);\n"
    "        activeAudioRef.current = audio;\n"
    "        await new Promise<void>((resolve, reject) => {\n"
    "          audio.onplaying = () => {\n"
    "            if (speakSeq === speakSeqRef.current) {\n"
    "              setIsSpeaking(true);\n"
    "            }\n"
    "          };\n"
    "          audio.onended = () => {\n"
    "            if (speakSeq === speakSeqRef.current) {\n"
    "              setIsSpeaking(false);\n"
    "            }\n"
    "            resolve();\n"
    "          };\n"
    "          audio.onerror = () => {\n"
    "            if (speakSeq === speakSeqRef.current) {\n"
    "              setIsSpeaking(false);\n"
    "            }\n"
    "            reject(new Error(\"TTS audio playback failed\"));\n"
    "          };\n"
    "          void audio.play().catch((err) => {\n"
    "            reject(err instanceof Error ? err : new Error(\"TTS audio playback error\"));\n"
    "          });\n"
    "        });\n"
    "        if (speakSeq === speakSeqRef.current) {\n"
    "          setIsSpeaking(false);\n"
    "        }\n"
    "        return;"
)
new4 = (
    "        // ── iOS-safe: AudioContext.decodeAudioData instead of new Audio(dataUri) ──\n"
    "        // new Audio(dataUri).play() is blocked on iOS Safari after any await.\n"
    "        // The shared AudioContext stays unlocked after the user-gesture unlock.\n"
    "        const AudioCtxCls = (window as any).AudioContext || (window as any).webkitAudioContext;\n"
    "        const ctx: AudioContext | null = audioCtxRef.current ||\n"
    "          (AudioCtxCls ? (audioCtxRef.current = new AudioCtxCls()) : null);\n"
    "        if (ctx) {\n"
    "          if (ctx.state === \"suspended\") await ctx.resume();\n"
    "          const b64 = ttsData.audioBase64 as string;\n"
    "          const binStr = atob(b64);\n"
    "          const bytes = new Uint8Array(binStr.length);\n"
    "          for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);\n"
    "          const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));\n"
    "          if (speakSeq !== speakSeqRef.current) return; // interrupted mid-decode\n"
    "          const source = ctx.createBufferSource();\n"
    "          source.buffer = audioBuffer;\n"
    "          source.connect(ctx.destination);\n"
    "          audioSourceRef.current = source;\n"
    "          setIsSpeaking(true);\n"
    "          await new Promise<void>((resolve) => { source.onended = () => resolve(); source.start(0); });\n"
    "          audioSourceRef.current = null;\n"
    "        } else {\n"
    "          // Fallback for very old browsers without AudioContext\n"
    "          const mimeType = String(ttsData.mimeType || \"audio/wav\");\n"
    "          const audio = new Audio(`data:${mimeType};base64,${ttsData.audioBase64}`);\n"
    "          activeAudioRef.current = audio;\n"
    "          await new Promise<void>((resolve, reject) => {\n"
    "            audio.onplaying = () => { if (speakSeq === speakSeqRef.current) setIsSpeaking(true); };\n"
    "            audio.onended  = () => { if (speakSeq === speakSeqRef.current) setIsSpeaking(false); resolve(); };\n"
    "            audio.onerror  = () => { if (speakSeq === speakSeqRef.current) setIsSpeaking(false); reject(new Error(\"audio error\")); };\n"
    "            void audio.play().catch(reject);\n"
    "          });\n"
    "        }\n"
    "        if (speakSeq === speakSeqRef.current) setIsSpeaking(false);\n"
    "        return;"
)
if old4 in src:
    src = src.replace(old4, new4, 1)
    changes.append("FIX 1D: speak() uses AudioContext.decodeAudioData (iOS safe)")
else:
    changes.append("FIX 1D MISSED")

# ── FIX 2: Board SVG — responsive height ─────────────────────────────────────
old5 = '<svg viewBox="0 0 580 340" width="100%" height="340" role="img" aria-label="AI Tutor Whiteboard">'
new5 = '<svg viewBox="0 0 580 340" width="100%" style={{ display: "block", height: "auto", maxHeight: "340px" }} role="img" aria-label="AI Tutor Whiteboard">'
if old5 in src:
    src = src.replace(old5, new5, 1)
    changes.append("FIX 2: Board SVG responsive height")
else:
    changes.append("FIX 2 MISSED")

# ── FIX 3: Mobile — coach/question panel text bigger + seamless layout ────────
old6 = "          .ca-coach-speech { display: none; }\n          .ca-coach-nav { display: none; }"
new6 = (
    "          .ca-coach-speech { display: block; }\n"
    "          .ca-coach-speech p { font-size: 1.05rem; line-height: 1.5; -webkit-line-clamp: 6; }\n"
    "          .ca-coach-nav { display: none; }\n"
    "          .vedic-focus-copy h3 { font-size: 1.18rem; }\n"
    "          .vedic-focus-copy p:last-child { font-size: 0.98rem; }\n"
    "          .vedic-focus-coach { grid-template-columns: 72px minmax(0,1fr); gap: 0.5rem; }\n"
    "          .vedic-focus-avatar { min-height: 72px; }\n"
    "          .vedic-focus-panel { padding: 0.5rem 0.55rem; gap: 0.45rem; }\n"
    "          .vedic-answer-block { padding: 0.65rem 0.7rem; }\n"
    "          .vedic-answer-input { min-height: 52px; font-size: 1.05rem; }\n"
    "          .vedic-action-row .button, .vedic-focus-actions .button { font-size: 0.98rem; min-height: 48px; }"
)
if old6 in src:
    src = src.replace(old6, new6, 1)
    changes.append("FIX 3: Mobile coach/question panel — seamless text + input sizing")
else:
    changes.append("FIX 3 MISSED")

# ── FIX 4: Question card text bigger on mobile ────────────────────────────────
# Find .vedic-question-text or similar
old7 = "          .vedic-answer-block {\n            padding: 0.7rem;\n            border-radius: 18px;\n          }"
new7 = (
    "          .vedic-answer-block {\n"
    "            padding: 0.7rem;\n"
    "            border-radius: 18px;\n"
    "          }\n"
    "          .vedic-question-label { font-size: 0.78rem; }\n"
    "          .vedic-question-text  { font-size: 1.15rem; line-height: 1.45; }\n"
    "          .vedic-hint-card      { font-size: 0.96rem; }"
)
if old7 in src:
    src = src.replace(old7, new7, 1)
    changes.append("FIX 4: Question + hint text bigger on mobile")
else:
    changes.append("FIX 4 MISSED — may already be covered")

with open(path, "w", encoding="utf-8") as f:
    f.write(src)

for c in changes:
    print(c)
