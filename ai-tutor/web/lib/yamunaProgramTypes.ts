// ─── Yamuna Program Bank — Type Definitions ────────────────────────────────

export type ProgramTier = "beginner" | "intermediate" | "advanced" | "leetcode" | "hackathon";

export const TIER_META: Record<ProgramTier, { label: string; emoji: string; color: string; xpBase: number }> = {
  beginner:     { label: "Beginner",     emoji: "🟢", color: "#22C55E", xpBase: 50  },
  intermediate: { label: "Intermediate", emoji: "🔵", color: "#3B82F6", xpBase: 100 },
  advanced:     { label: "Advanced",     emoji: "🟡", color: "#EAB308", xpBase: 150 },
  leetcode:     { label: "LeetCode",     emoji: "🔴", color: "#EF4444", xpBase: 250 },
  hackathon:    { label: "Hackathon",    emoji: "🏆", color: "#A855F7", xpBase: 400 },
};

export interface TestCase {
  id: string;
  label: string;
  /**
   * Lines fed to System.in (Scanner) in order.
   * Joined with "\n" as the full stdin string.
   */
  mockInputs: string[];
  expectedOutput: string;      // trimmed stdout to match against
  isBoundary?: boolean;        // edge/boundary case — shown with ⚠ badge
  isHidden?: boolean;          // revealed only after wrong submission
}

export interface ReferenceProgram {
  title: string;
  description: string;
  code: string;
  explanation?: string;
}

export interface YamunaProgram {
  id: string;
  chapterId: string;           // e.g. "JCH01_HELLO"
  chapterNumber: number;       // 1–30
  tier: ProgramTier;
  tierIndex: number;           // position within tier (0, 1, 2)
  title: string;
  emoji: string;
  tagline: string;             // one-line hook shown on program card

  // ── Problem definition ──
  problemStatement: string;
  inputFormat: string;         // what Scanner reads
  outputFormat: string;        // what System.out.println prints
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];

  // ── Adaptive help system ──
  hints: string[];             // revealed ONE at a time — max 5
  referenceProgram?: ReferenceProgram;

  // ── Execution ──
  /**
   * Pre-filled starter code. Must be a valid Java class named Main.
   * Example:
   *   import java.util.Scanner;
   *   public class Main {
   *       public static void main(String[] args) {
   *           Scanner sc = new Scanner(System.in);
   *           // write your code here
   *       }
   *   }
   */
  starterCode: string;
  solution: string;            // correct answer — shown only after completion
  testCases: TestCase[];

  // ── Metadata ──
  concepts: string[];          // tags: "Scanner", "if/else", "ArrayList", etc.
  xpReward: number;
  estimatedMinutes: number;
  timeComplexityTarget?: string;
  spaceComplexityTarget?: string;
  designChallenge?: string;    // open-ended extension for hackathon tier
}

// ── Adaptive scoring ────────────────────────────────────────────────────────

export interface ProgramAttemptResult {
  programId: string;
  solved: boolean;
  hintsUsed: number;
  failedAttempts: number;
  secondsElapsed: number;
  testCasesPassed: number;
  totalTestCases: number;
  boundaryPassed: boolean;
}

export function computeProgramScore(r: ProgramAttemptResult): number {
  if (!r.solved) return 0;
  let score = 1.0;
  score -= r.hintsUsed      * 0.12;
  score -= r.failedAttempts * 0.08;
  if (!r.boundaryPassed)    score -= 0.15;
  if (r.secondsElapsed < 120) score += 0.05;
  return Math.max(0, Math.min(1, score));
}

export type AdaptiveDecision = "next_tier" | "next_program" | "show_reference";

export function adaptiveDecision(score: number): AdaptiveDecision {
  if (score > 0.80) return "next_tier";
  if (score > 0.40) return "next_program";
  return "show_reference";
}
