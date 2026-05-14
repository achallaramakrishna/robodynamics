import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/kaveri/check-letter
 *
 * Hybrid approach:
 *   - GPT-4o mini vision (detail:low) → cheapest image tier (~₹0.06/scan)
 *   - Analyzes: correct letter? quality? warm encouragement? one tip?
 *
 * Body: { imageBase64: string, targetChar: string, studentName: string, kannadaLevel: string }
 * Returns: { correct: boolean, quality: "excellent"|"good"|"needs_work", feedback: string, tip: string|null }
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_VISION_MODEL = "gpt-4o-mini";

type KannadaLevel = "native" | "some" | "beginner" | "zero";

function gracefulFallback(studentName: string, isEnglish: boolean) {
  // Safe fallback: never auto-pass writing when we can't actually verify it.
  // Return correct: false so the child is encouraged to keep practising rather
  // than receiving misleading confirmation that incorrect writing is correct.
  return NextResponse.json({
    correct: false,
    quality: "needs_work",
    feedback: isEnglish
      ? `Good try ${studentName}! Keep practising — the more you trace, the better you get!`
      : `ಉತ್ತಮ ಪ್ರಯತ್ನ ${studentName}! ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡು, ನೀನು ಖಂಡಿತ ಕಲಿಯುತ್ತೀಯಾ!`,
    tip: isEnglish
      ? "Try tracing the letter slowly, one stroke at a time."
      : "ಅಕ್ಷರವನ್ನು ನಿಧಾನವಾಗಿ, ಒಂದೊಂದೇ ಗೆರೆಯನ್ನು ಬರೆಯಲು ಪ್ರಯತ್ನಿಸು.",
  });
}

export async function POST(request: NextRequest) {
  let body: { imageBase64?: string; targetChar?: string; studentName?: string; kannadaLevel?: KannadaLevel };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { imageBase64, targetChar, studentName = "Friend", kannadaLevel = "beginner" } = body;

  if (!imageBase64 || !targetChar) {
    return NextResponse.json({ error: "imageBase64 and targetChar are required" }, { status: 400 });
  }

  const isEnglish = kannadaLevel === "zero" || kannadaLevel === "beginner";

  // No API key → graceful fallback so the feature never breaks the lesson
  if (!OPENAI_API_KEY) {
    console.warn("[check-letter] OPENAI_API_KEY not set — returning graceful fallback");
    return gracefulFallback(studentName, isEnglish);
  }

  const feedbackLang = isEnglish
    ? "warm English (1-2 sentences, 6-year-old friendly)"
    : "Kannada + English mix (1-2 sentences, warm)";

  const systemPrompt = `You are Kaveri, a kind, encouraging Kannada teacher for children aged 5-7.
A child has handwritten the Kannada letter "${targetChar}" on paper and photographed it.

Respond ONLY with a valid JSON object — no markdown fences, no explanations:
{
  "correct": <true if the letter is "${targetChar}" or a reasonable attempt, false otherwise>,
  "quality": <"excellent" | "good" | "needs_work">,
  "feedback": <${feedbackLang}>,
  "tip": <null or one short improvement tip in ${isEnglish ? "English" : "Kannada"}>
}

Grading guide:
- "excellent": shape closely matches "${targetChar}", clear strokes
- "good": shape recognisable, minor issues — award this generously for young children
- "needs_work": very different from "${targetChar}" or unreadable

Always be warm and encouraging. Never say the child failed.`;

  try {
    const oaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_VISION_MODEL,
        max_tokens: 220,
        temperature: 0.4,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: "low", // cheapest tier — sufficient for single-letter recognition
                },
              },
              { type: "text", text: systemPrompt },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(18_000), // 18 s timeout
    });

    if (!oaiResp.ok) {
      const errText = await oaiResp.text().catch(() => "unknown");
      console.error("[check-letter] OpenAI error:", oaiResp.status, errText);
      return gracefulFallback(studentName, isEnglish);
    }

    const oaiData = await oaiResp.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = oaiData.choices?.[0]?.message?.content ?? "";

    // Strip optional markdown fences
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    let result: { correct?: boolean; quality?: string; feedback?: string; tip?: string | null };
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error("[check-letter] JSON parse failed for:", cleaned);
      return gracefulFallback(studentName, isEnglish);
    }

    return NextResponse.json({
      correct: result.correct !== false,
      quality: ["excellent", "good", "needs_work"].includes(result.quality ?? "") ? result.quality : "good",
      feedback: result.feedback || (isEnglish ? `Well done ${studentName}!` : `ಶಭಾಷ್ ${studentName}!`),
      tip: result.tip ?? null,
    });
  } catch (err) {
    console.error("[check-letter] unexpected error:", err);
    return gracefulFallback(studentName, isEnglish);
  }
}
