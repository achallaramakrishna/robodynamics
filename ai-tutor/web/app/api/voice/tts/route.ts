import { NextRequest, NextResponse } from "next/server";
import { getSpeakerForAvatar } from "@/lib/avatarVoices";

const SARVAM_TTS_URL = process.env.SARVAM_TTS_URL || "https://api.sarvam.ai/text-to-speech";
const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";
const SARVAM_DEFAULT_MODEL = process.env.SARVAM_TTS_MODEL || "bulbul:v3";
const SARVAM_DEFAULT_LANGUAGE_CODE = process.env.SARVAM_DEFAULT_LANGUAGE_CODE || "en-IN";

type TtsRequest = {
  text?: string;
  avatarId?: string;
  languageCode?: string;
  pace?: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TtsRequest;
    const text = String(body?.text || "").trim();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    if (!SARVAM_API_KEY) {
      return NextResponse.json({ error: "Sarvam is not configured on server" }, { status: 503 });
    }

    const speaker = getSpeakerForAvatar(body.avatarId);
    const pace = typeof body.pace === "number" && Number.isFinite(body.pace)
      ? Math.min(1.6, Math.max(0.6, body.pace))
      : 1.0;

    const payload = {
      text: text.slice(0, 1400),
      target_language_code: body.languageCode || SARVAM_DEFAULT_LANGUAGE_CODE,
      speaker,
      model: SARVAM_DEFAULT_MODEL,
      pace
    };

    const response = await fetch(SARVAM_TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const raw = await response.text();
    let parsed: any = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = null;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Sarvam TTS request failed",
          statusCode: response.status,
          detail: parsed || raw
        },
        { status: 502 }
      );
    }

    const audioBase64 =
      (Array.isArray(parsed?.audios) ? parsed.audios[0] : null) ||
      parsed?.audio ||
      parsed?.audio_base64 ||
      "";

    if (!audioBase64) {
      return NextResponse.json({ error: "Sarvam returned no audio" }, { status: 502 });
    }

    return NextResponse.json({
      provider: "sarvam",
      speaker,
      model: SARVAM_DEFAULT_MODEL,
      mimeType: "audio/wav",
      audioBase64
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "TTS route failed" },
      { status: 500 }
    );
  }
}

