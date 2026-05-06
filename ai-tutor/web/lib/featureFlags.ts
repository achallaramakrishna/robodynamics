// ─────────────────────────────────────────────────────────────────────────────
// Feature Flags — MoneyMind & Platform
//
// HOW TO USE:
//   In .env.local (local dev) or production env:
//     NEXT_PUBLIC_MONEYMIND_CHECKOUT_ENABLED=true
//     NEXT_PUBLIC_MONEYMIND_BASELINE_TEST_ENABLED=true
//
//   All flags default to FALSE (disabled) if env var is not set.
//   This means new features are invisible until explicitly enabled.
//
// HOW TO CHECK IN COMPONENTS:
//   import { FLAGS } from "@/lib/featureFlags";
//   if (FLAGS.MONEYMIND_CHECKOUT) { ... }
// ─────────────────────────────────────────────────────────────────────────────

function flag(envVar: string): boolean {
  return process.env[envVar] === "true";
}

export const FLAGS = {
  // ── MoneyMind ──────────────────────────────────────────────────────────────

  /** Razorpay checkout page at /checkout?bundle=moneymind-6-levels */
  MONEYMIND_CHECKOUT: flag("NEXT_PUBLIC_MONEYMIND_CHECKOUT_ENABLED"),

  /** Financial Baseline Test entry page at /ai-tutor/demo?product=moneymind */
  MONEYMIND_BASELINE_TEST: flag("NEXT_PUBLIC_MONEYMIND_BASELINE_TEST_ENABLED"),

  /** XP Badge / Certificate screen at end of each level */
  MONEYMIND_XP_BADGE: flag("NEXT_PUBLIC_MONEYMIND_XP_BADGE_ENABLED"),

  // ── Future flags (add here, default off) ──────────────────────────────────
  // MONEYMIND_AI_TUTOR: flag("NEXT_PUBLIC_MONEYMIND_AI_TUTOR_ENABLED"),
  // MONEYMIND_LEADERBOARD: flag("NEXT_PUBLIC_MONEYMIND_LEADERBOARD_ENABLED"),
} as const;

export type FeatureFlag = keyof typeof FLAGS;
