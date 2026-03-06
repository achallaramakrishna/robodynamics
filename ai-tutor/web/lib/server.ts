const TUTOR_API_BASE = process.env.TUTOR_API_BASE_URL || "http://localhost:8091";
const TUTOR_INTERNAL_KEY = process.env.TUTOR_INTERNAL_KEY || "";

export async function callTutorApi(path: string, method: string, body?: unknown) {
  const response = await fetch(`${TUTOR_API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(TUTOR_INTERNAL_KEY ? { "X-AI-TUTOR-KEY": TUTOR_INTERNAL_KEY } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Tutor API ${response.status}: ${text}`);
  }

  return response.json();
}

