import { NextRequest, NextResponse } from "next/server";

const DEVANAGARI_RE = /[\u0900-\u097F]/;
const KANNADA_RE = /[\u0C80-\u0CFF]/;

function inferLanguage(text: string, requested?: string | null) {
  const normalized = String(requested || "").trim().toLowerCase();
  if (normalized.startsWith("hi")) return "hi";
  if (normalized.startsWith("kn")) return "kn";
  if (normalized.startsWith("en")) return "en";
  if (KANNADA_RE.test(text)) return "kn";
  if (DEVANAGARI_RE.test(text)) return "hi";
  return "en";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const lang = inferLanguage(text, body?.languageCode);
    const gttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob&sl=auto`;

    const audioRes = await fetch(gttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
      cache: "no-store",
    });

    if (!audioRes.ok) {
      console.error("[Web TTS] Google TTS error:", audioRes.status);
      return NextResponse.json(
        { error: `TTS fetch failed: ${audioRes.status}` },
        { status: 502 },
      );
    }

    const audioBuffer = await audioRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      audioBase64,
      mimeType: "audio/mpeg",
      provider: "google-translate-tts",
      languageCode: lang,
    });
  } catch (err) {
    console.error("[Web TTS] Unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
