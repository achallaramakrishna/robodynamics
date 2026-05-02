// ─────────────────────────────────────────────────────────────────────────────
// MoneyMind Auth Utilities
//
// MoneyMind uses the same user identity as the existing LMS session.
// The LMS JWT login stores userId in the rd_user_session cookie.
// We read that to get the MoneyMind user_id — no separate login needed.
//
// Fallback: if no session exists (unauthenticated visitor), we use the
// demo user 101 (seeded by seed_moneymind.py) so the simulator works
// without requiring login.
// ─────────────────────────────────────────────────────────────────────────────

import { parseAppSession, APP_SESSION_COOKIE } from "@/lib/appSession";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const DEMO_USER_ID = 101;

/**
 * Extract MoneyMind user_id from the LMS session cookie.
 * Called in Next.js Server Components / Route Handlers where cookies() is available.
 */
export function getMoneyMindUserId(cookieStore: ReadonlyRequestCookies): number {
  const raw = cookieStore.get(APP_SESSION_COOKIE)?.value;
  if (!raw) return DEMO_USER_ID;

  const session = parseAppSession(raw);
  if (!session) return DEMO_USER_ID;

  // Use childId for student sessions (the learner), userId for parent sessions
  const id = (session as { childId?: number; userId?: number }).childId
    ?? (session as { userId?: number }).userId
    ?? DEMO_USER_ID;

  return typeof id === "number" && id > 0 ? id : DEMO_USER_ID;
}

/**
 * Check if the current session is an authenticated (non-demo) user.
 */
export function isMoneyMindAuthenticated(cookieStore: ReadonlyRequestCookies): boolean {
  const userId = getMoneyMindUserId(cookieStore);
  return userId !== DEMO_USER_ID;
}
