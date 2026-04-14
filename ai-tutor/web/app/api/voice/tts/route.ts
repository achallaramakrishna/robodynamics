import { NextRequest, NextResponse } from "next/server";
import { getSpeakerForAvatar } from "@/lib/avatarVoices";

// ── Provider selection ────────────────────────────────────────────────────────
// TTS_PROVIDER=edge    → Microsoft Edge TTS (free, Indian neural voices, no key)
// TTS_PROVIDER=sarvam  → Sarvam AI (paid, best Indian language support)
// TTS_PROVIDER=browser → fallback to browser speechSynthesis (client-side)
function normalizeTtsProvider(value?: string): "gtts" | "google" | "edge" | "sarvam" | "browser" {
  const v = String(value || "").trim().toLowerCase();
  if (v === "sarvam") return "sarvam";
  if (v === "edge") return "edge";
  if (v === "gtts" || v === "google") return "google";
  return "browser";
}
const TTS_PROVIDER = normalizeTtsProvider(
  process.env.TTS_PROVIDER || process.env.NEXT_PUBLIC_TTS_PROVIDER || "google"
);

const TUTOR_API_BASE = process.env.TUTOR_API_BASE_URL || "http://localhost:8091";

// ── Edge TTS voices ───────────────────────────────────────────────────────────
// Female Indian English — warm, clear, student-friendly
const EDGE_VOICE_FEMALE = "en-IN-NeerjaNeural";
// Male Indian English — calm, authoritative
const EDGE_VOICE_MALE   = "en-IN-PrabhatNeural";

function edgeVoiceForAvatar(avatarId?: string): string {
  // "priya" and any female avatar → Neerja; male avatars → Prabhat
  const id = String(avatarId || "").toLowerCase();
  if (id === "rohan" || id === "arjun" || id === "male") return EDGE_VOICE_MALE;
  return EDGE_VOICE_FEMALE;
}

// ── Sarvam config ─────────────────────────────────────────────────────────────
const SARVAM_TTS_URL     = process.env.SARVAM_TTS_URL || "https://api.sarvam.ai/text-to-speech";
const SARVAM_API_KEY     = process.env.SARVAM_API_KEY || "";
const SARVAM_MODEL       = process.env.SARVAM_TTS_MODEL || "bulbul:v2";
const SARVAM_LANG        = process.env.SARVAM_DEFAULT_LANGUAGE_CODE || "en-IN";
const SARVAM_PACE        = Number(process.env.SARVAM_DEFAULT_TTS_PACE || "1.0");

type TtsRequest = {
  text?: string;
  avatarId?: string;
  languageCode?: string;
  pace?: number;
};

// ── Edge TTS handler ──────────────────────────────────────────────────────────
async function handleEdgeTts(text: string, avatarId?: string): Promise<NextResponse> {
  try {
    // Dynamic import so it only loads server-side
    const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");
    const voice = edgeVoiceForAvatar(avatarId);

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      const readable = tts.toStream(text.slice(0, 1400));
      readable.on("data", (chunk: Buffer) => chunks.push(chunk));
      readable.on("end", resolve);
      readable.on("error", reject);
    });

    const audioBuffer = Buffer.concat(chunks);
    const audioBase64 = audioBuffer.toString("base64");

    return NextResponse.json({
      provider: "edge",
      voice,
      mimeType: "audio/mpeg",
      audioBase64,
    });
  } catch (err) {
    // If edge-tts fails (network issue, etc.), signal browser fallback
    return NextResponse.json(
      { provider: "browser", fallback: "speechSynthesis", reason: String(err) },
      { status: 200 } // 200 so client gracefully falls back
    );
  }
}

// ── Sarvam TTS handler ────────────────────────────────────────────────────────
async function handleSarvamTts(
  text: string,
  avatarId?: string,
  languageCode?: string,
  pace?: number
): Promise<NextResponse> {
  if (!SARVAM_API_KEY) {
    return NextResponse.json(
      { provider: "sarvam", error: "Sarvam is not configured on server" },
      { status: 503 }
    );
  }
  const speaker = getSpeakerForAvatar(avatarId);
  const safePace =
    typeof pace === "number" && Number.isFinite(pace)
      ? Math.min(1.6, Math.max(0.6, pace))
      : Math.min(1.6, Math.max(0.6, SARVAM_PACE));

  const response = await fetch(SARVAM_TTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": SARVAM_API_KEY,
    },
    body: JSON.stringify({
      text: text.slice(0, 1400),
      target_language_code: languageCode || SARVAM_LANG,
      speaker,
      model: SARVAM_MODEL,
      pace: safePace,
    }),
    cache: "no-store",
  });

  const raw = await response.text();
  let parsed: Record<string, unknown> | null = null;
  try { parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : null; } catch { parsed = null; }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Sarvam TTS request failed", statusCode: response.status, detail: parsed || raw },
      { status: 502 }
    );
  }

  const audioBase64 =
    (Array.isArray(parsed?.audios) ? (parsed.audios as string[])[0] : null) ||
    (parsed?.audio as string | undefined) ||
    (parsed?.audio_base64 as string | undefined) ||
    "";

  if (!audioBase64) {
    return NextResponse.json({ error: "Sarvam returned no audio" }, { status: 502 });
  }

  return NextResponse.json({
    provider: "sarvam",
    speaker,
    model: SARVAM_MODEL,
    mimeType: "audio/wav",
    audioBase64,
  });
}

// ── Google Translate TTS handler (Direct, no key needed) ──────────────────────
async function handleGoogleTranslateTts(text: string, avatarId?: string): Promise<NextResponse> {
  try {
    const encodedText = encodeURIComponent(text.slice(0, 1000)); // Increased limit
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=en-IN&client=tw-ob`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) throw new Error("Google TTS failed");

    const arrayBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      provider: "google",
      mimeType: "audio/mpeg",
      audioBase64,
    });
  } catch (err) {
    return NextResponse.json({
      provider: "browser",
      fallback: "speechSynthesis",
      reason: String(err),
    });
  }
}

// ── gTTS handler (via Python tutor-api) ──────────────────────────────────────
// NOTE: This throws on failure so the caller can try the next provider.
async function handleGttsTts(text: string, avatarId?: string): Promise<NextResponse> {
  const id = String(avatarId || "").toLowerCase();
  const gender = (id === "rohan" || id === "arjun" || id === "male") ? "male" : "female";
  const response = await fetch(`${TUTOR_API_BASE}/ai-tutor-api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text.slice(0, 1400), gender }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000), // 10s — gTTS round-trips Google Translate
  });
  if (!response.ok) {
    throw new Error(`gTTS API ${response.status}`);
  }
  const data = await response.json() as { provider: string; mimeType: string; audioBase64: string };
  if (!data?.audioBase64) throw new Error("gTTS returned no audio");
  return NextResponse.json(data);
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TtsRequest;
    const text = String(body?.text || "").trim();
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (TTS_PROVIDER === "google") {
      // Google Translate direct (Indian accent, no API key) → Edge TTS Indian neural → browser
      const gtResult = await handleGoogleTranslateTts(text, body.avatarId);
      const gtData = await gtResult.clone().json().catch(() => null) as Record<string, unknown> | null;
      if (gtData?.audioBase64) return gtResult;
      // Google Translate blocked/failed — fall back to Edge TTS (en-IN-NeerjaNeural)
      return handleEdgeTts(text, body.avatarId);
    }
    if (TTS_PROVIDER === "gtts") {
      // gTTS Python API → Google Translate direct → Edge TTS
      try {
        return await handleGttsTts(text, body.avatarId);
      } catch {
        const gtResult = await handleGoogleTranslateTts(text, body.avatarId);
        const gtData = await gtResult.clone().json().catch(() => null) as Record<string, unknown> | null;
        if (gtData?.audioBase64) return gtResult;
        return handleEdgeTts(text, body.avatarId);
      }
    }
    if (TTS_PROVIDER === "edge") {
      return handleEdgeTts(text, body.avatarId);
    }
    if (TTS_PROVIDER === "sarvam") {
      return handleSarvamTts(text, body.avatarId, body.languageCode, body.pace);
    }

    // browser fallback
    return NextResponse.json({
      provider: "browser",
      fallback: "speechSynthesis",
      reason: "Browser speech synthesis is configured for this environment",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "TTS route failed" },
      { status: 500 }
    );
  }
}
