export type VaaniMotionKind =
  | "none"
  | "book"
  | "run"
  | "hop"
  | "celebrate"
  | "glow";

export interface VaaniVisualMotion {
  kind: VaaniMotionKind;
  label?: string;
}

interface MotionInput {
  lessonId?: string | null;
  assetPath?: string | null;
  title?: string | null;
  wordHindi?: string | null;
  wordEnglish?: string | null;
}

function asHaystack(...values: Array<string | null | undefined>): string {
  return values.filter(Boolean).join(" ").toLowerCase();
}

export function getVaaniVisualMotion(input: MotionInput): VaaniVisualMotion {
  const haystack = asHaystack(
    input.lessonId,
    input.assetPath,
    input.title,
    input.wordHindi,
    input.wordEnglish,
  );

  if (!haystack) return { kind: "none" };

  if (
    haystack.includes("book") ||
    haystack.includes("kitaab") ||
    haystack.includes("notebook")
  ) {
    return { kind: "book", label: "Book pages opening" };
  }

  if (
    haystack.includes("dog") ||
    haystack.includes("kutta") ||
    haystack.includes("horse") ||
    haystack.includes("gho")
  ) {
    return { kind: "run", label: "Running action" };
  }

  if (
    haystack.includes("cat") ||
    haystack.includes("billi") ||
    haystack.includes("child") ||
    haystack.includes("boy") ||
    haystack.includes("girl") ||
    haystack.includes("raj")
  ) {
    return { kind: "hop", label: "Playful bounce" };
  }

  if (
    haystack.includes("mastery") ||
    haystack.includes("review") ||
    haystack.includes("champion") ||
    haystack.includes("trophy") ||
    haystack.includes("celebration")
  ) {
    return { kind: "celebrate", label: "Celebration sparkle" };
  }

  if (
    haystack.includes("tree") ||
    haystack.includes("magic") ||
    haystack.includes("story") ||
    haystack.includes("planet")
  ) {
    return { kind: "glow", label: "Soft magical glow" };
  }

  return { kind: "none" };
}
