import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";
import { MM_L1_1_LESSON, MM_L1_2_LESSON } from "./moneyMindLessons";
import { MM_L1_3_LESSON, MM_L1_4_LESSON } from "./moneyMindLessonsL1Rest";
import { MM_L2_1_LESSON, MM_L2_2_LESSON } from "./moneyMindLessonsL2";
import { MM_L2_3_LESSON, MM_L2_4_LESSON } from "./moneyMindLessonsL2Rest";
import { MM_L3_1_LESSON, MM_L3_2_LESSON, MM_L3_3_LESSON, MM_L3_4_LESSON } from "./moneyMindLessonsL3";
import { MM_L4_1_LESSON, MM_L4_2_LESSON, MM_L4_3_LESSON, MM_L4_4_LESSON } from "./moneyMindLessonsL4";
import { MM_L5_1_LESSON, MM_L5_2_LESSON, MM_L5_3_LESSON, MM_L5_4_LESSON } from "./moneyMindLessonsL5";
import { MM_L6_1_LESSON, MM_L6_2_LESSON, MM_L6_3_LESSON, MM_L6_4_LESSON } from "./moneyMindLessonsL6";

export const MONEYMIND_LESSON_REGISTRY: Record<string, MoneyMindLessonPayload> = {
  MM_L1_1: MM_L1_1_LESSON,
  MM_L1_2: MM_L1_2_LESSON,
  MM_L1_3: MM_L1_3_LESSON,
  MM_L1_4: MM_L1_4_LESSON,
  MM_L2_1: MM_L2_1_LESSON,
  MM_L2_2: MM_L2_2_LESSON,
  MM_L2_3: MM_L2_3_LESSON,
  MM_L2_4: MM_L2_4_LESSON,
  MM_L3_1: MM_L3_1_LESSON,
  MM_L3_2: MM_L3_2_LESSON,
  MM_L3_3: MM_L3_3_LESSON,
  MM_L3_4: MM_L3_4_LESSON,
  MM_L4_1: MM_L4_1_LESSON,
  MM_L4_2: MM_L4_2_LESSON,
  MM_L4_3: MM_L4_3_LESSON,
  MM_L4_4: MM_L4_4_LESSON,
  MM_L5_1: MM_L5_1_LESSON,
  MM_L5_2: MM_L5_2_LESSON,
  MM_L5_3: MM_L5_3_LESSON,
  MM_L5_4: MM_L5_4_LESSON,
  MM_L6_1: MM_L6_1_LESSON,
  MM_L6_2: MM_L6_2_LESSON,
  MM_L6_3: MM_L6_3_LESSON,
  MM_L6_4: MM_L6_4_LESSON,
};

export function getLessonById(id: string): MoneyMindLessonPayload | null {
  return MONEYMIND_LESSON_REGISTRY[id] ?? null;
}

/** Get next lesson id in the same level, or null if it's the last one */
export function getNextLessonId(currentId: string): string | null {
  const keys = Object.keys(MONEYMIND_LESSON_REGISTRY);
  const idx = keys.indexOf(currentId);
  if (idx === -1 || idx === keys.length - 1) return null;
  const next = keys[idx + 1];
  const currentLevel = currentId.match(/MM_L(\d+)_/)?.[1];
  const nextLevel = next.match(/MM_L(\d+)_/)?.[1];
  return currentLevel === nextLevel ? next : null;
}
