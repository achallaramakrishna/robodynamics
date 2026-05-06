type NeetClientEvent = {
  eventName: string;
  sessionType?: string;
  questionId?: string | null;
  chapterCode?: string | null;
  subject?: string | null;
  payload?: Record<string, any>;
};

export function trackNeetEvent(event: NeetClientEvent): void {
  if (typeof window === "undefined") return;
  const key = localStorage.getItem("meera_session_key");
  const body = JSON.stringify({
    key: key || null,
    events: [event],
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/neet/events", blob);
      return;
    }
  } catch {
    // fall back to fetch below
  }

  fetch("/api/neet/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
