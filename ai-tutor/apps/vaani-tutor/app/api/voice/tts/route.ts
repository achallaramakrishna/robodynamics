import { NextRequest, NextResponse } from "next/server";

// Devanagari Unicode range
const DEVANAGARI_RE = /[ऀ-ॿ]/;

/**
 * TTS proxy using Google Translate TTS (same approach as MindSutra).
 * Free, no API key required. Server-side proxy avoids browser CORS issues.
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const cleanText = text.trim();
    const hasDevanagari = DEVANAGARI_RE.test(cleanText);
    const lang = hasDevanagari ? "hi" : "en";

    // Google Translate TTS — same endpoint MindSutra uses
    const gttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${lang}&client=tw-ob`;

    const audioRes = await fetch(gttsUrl, {
      headers: {
        // Required: Google blocks requests without a user-agent
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });

    if (!audioRes.ok) {
      console.error("[Vaani TTS] Google TTS error:", audioRes.status);
      return NextResponse.json(
        { error: `TTS fetch failed: ${audioRes.status}` },
        { status: 502 }
      );
    }

    // Stream the MP3 back to the client
    const audioBuffer = await audioRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({ audioBase64, mimeType: "audio/mpeg" });
  } catch (err) {
    console.error("[Vaani TTS] Unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
