/**
 * Vaani Spaced Repetition Engine
 * SM-2 inspired algorithm for Hindi character learning review
 */

export interface LearnedChar {
  char: string;
  word: string;
  wordEng: string;
  assetPath: string;  // Stores lesson image path for revision prompts
  score: number;      // SM-2 easiness factor
  reviewAfterLesson: number; // Next lesson to review after
  learnedAtLesson: number;   // Lesson where character was learned
}

const STORAGE_KEY = "vaani_learned_chars";

/**
 * Get all learned characters from localStorage
 */
function getAllLearned(): LearnedChar[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save learned characters to localStorage
 */
function saveAllLearned(chars: LearnedChar[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
  } catch (e) {
    console.warn("Failed to save learned chars:", e);
  }
}

/**
 * Mark a character as learned at the current lesson
 * @param char - The Hindi character (e.g., "क")
 * @param word - The Hindi word example (e.g., "Kali")
 * @param wordEng - The English translation (e.g., "pot")
 * @param currentLessonIndex - Current lesson index (0-based)
 * @param assetPath - Path to the lesson image for revision display
 */
export function markLearned(
  char: string,
  word: string,
  wordEng: string,
  currentLessonIndex: number,
  assetPath: string = "/assets/gemini/placeholder.png"
): void {
  const all = getAllLearned();

  // Check if already learned
  const existing = all.findIndex(c => c.char === char);

  if (existing >= 0) {
    // Update existing entry
    all[existing] = {
      ...all[existing],
      word,
      wordEng,
      assetPath,
      learnedAtLesson: currentLessonIndex,
      // Keep score but reset review schedule
      reviewAfterLesson: currentLessonIndex + 1,
    };
  } else {
    // Add new learned character
    all.push({
      char,
      word,
      wordEng,
      assetPath,
      score: 2.5,  // SM-2 initial easiness
      learnedAtLesson: currentLessonIndex,
      reviewAfterLesson: currentLessonIndex + 1,  // Review next lesson
    });
  }

  saveAllLearned(all);
}

/**
 * Get characters due for review at the current lesson
 * Uses simple spaced repetition: review next lesson, then 2 lessons later, etc.
 * @param currentLessonIndex - Current lesson index (0-based)
 * @returns Array of characters due for review
 */
export function getDueForReview(currentLessonIndex: number): LearnedChar[] {
  const all = getAllLearned();

  // Characters due for review are those where reviewAfterLesson <= currentLessonIndex
  const due = all.filter(
    c => c.learnedAtLesson < currentLessonIndex && c.reviewAfterLesson <= currentLessonIndex
  );

  // Shuffle for variety
  return due.sort(() => Math.random() - 0.5);
}

/**
 * Mark a review attempt as correct or incorrect
 * Updates SM-2 score and next review time
 * @param char - The character being reviewed
 * @param correct - Whether the student's answer was correct
 * @param currentLessonIndex - Current lesson index (0-based)
 */
export function markReviewed(
  char: string,
  correct: boolean,
  currentLessonIndex: number
): void {
  const all = getAllLearned();
  const idx = all.findIndex(c => c.char === char);

  if (idx < 0) return; // Character not found

  const entry = all[idx];

  if (correct) {
    // Increase SM-2 score (easiness factor)
    entry.score = Math.max(1.3, entry.score + 0.1);
    // Schedule next review: current + score (rounded)
    entry.reviewAfterLesson = currentLessonIndex + Math.ceil(entry.score);
  } else {
    // Decrease SM-2 score
    entry.score = Math.max(1.3, entry.score - 0.2);
    // Review again next lesson
    entry.reviewAfterLesson = currentLessonIndex + 1;
  }

  saveAllLearned(all);
}

/**
 * Clear all learned characters (for testing or reset)
 */
export function clearAllLearned(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if storage is unavailable
  }
}

/**
 * Get statistics about learning progress
 */
export function getLearningStats(): {
  totalLearned: number;
  dueForReview: number;
  masterLevelChars: string[];
} {
  const all = getAllLearned();
  const masters = all.filter(c => c.score >= 2.5).map(c => c.char);

  return {
    totalLearned: all.length,
    dueForReview: all.filter(c => c.reviewAfterLesson <= 0).length,
    masterLevelChars: masters,
  };
}
