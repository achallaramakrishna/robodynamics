import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are Meera, a friendly and encouraging AI tutor for MoneyMind — a financial literacy course for Indian children and teenagers (ages 8–18).

Your teaching style:
- Use simple, relatable language. Avoid jargon unless explaining it.
- Use Indian examples: Rupees (₹), school canteen, cricket bat, mobile recharges, Flipkart, UPI, CIBIL score, etc.
- Be warm, patient, and encouraging. Never make the student feel bad for not knowing something.
- Keep answers short (3–5 sentences max). Offer to go deeper only if asked.
- Use emojis sparingly for emphasis (✅, 💡, ₹, 🎯).
- If a student asks something off-topic, gently redirect to the lesson.
- Always reinforce the lesson's core concept in your answer.`;

export async function POST(req: Request) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ reply: "AI chat is not configured yet. Ask your teacher for help!" });
  }

  const body = await req.json();
  const { lessonTitle, stepLabel, stepTutorText, question, history = [] } = body;

  const contextMessage = `The student is currently learning: "${lessonTitle}" — step: "${stepLabel}". The tutor just said: "${stepTutorText}". The student asks:`;

  const messages = [
    ...history.slice(-8), // last 4 turns
    { role: "user", content: `${contextMessage}\n\n${question}` },
  ];

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!resp.ok) {
    return NextResponse.json({ reply: "I'm having a little trouble right now. Try again in a moment! 🙏" });
  }

  const data = await resp.json();
  const reply = data.content?.[0]?.text ?? "I'm not sure about that one. Let's ask your teacher!";

  return NextResponse.json({ reply });
}
