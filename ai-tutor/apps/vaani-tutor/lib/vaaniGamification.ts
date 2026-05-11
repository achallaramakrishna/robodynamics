/**
 * Vaani Gamification System
 * Handles: XP points, badges, streaks, lesson completion tracking
 * Storage: localStorage (client-side, no backend required)
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface StudentGameProfile {
  studentId: string;                    // Session-based ID
  totalXP: number;                      // Cumulative across all levels
  currentStreak: number;                // Current practice streak (days)
  longestStreak: number;                // Personal best streak
  lastPracticeDate: string;             // ISO date string (YYYY-MM-DD)
  badgesEarned: {
    level: number;
    badges: string[];                   // e.g., ["swar_starter"]
  }[];
  levelStats: {
    level: number;
    totalLessons: number;
    completedLessons: number;
    masteredLessons: number;            // 3-star completions
    totalXP: number;
    badges: string[];
  }[];
}

export interface LessonCompletion {
  lessonId: string;
  level: number;
  completedAt: string;                  // ISO timestamp
  xpEarned: number;                     // 20-55
  starsEarned: number;                  // 1-3
  accuracy: number;                     // 0-100 (from MCQ correct answers)
  hintsUsed: number;                    // Count of hints requested
  mastered: boolean;                    // accuracy >= 85% && (no hints OR second attempt)
}

export interface BadgeDefinition {
  id: string;
  level: number;
  name: string;
  description: string;
  icon: string;                         // emoji
  requirement: {
    type: "lessons_completed" | "mastery";
    lessonsNeeded?: number;
    masteredNeeded?: number;
  };
}

// ============================================
// BADGE DEFINITIONS (1 PER LEVEL)
// ============================================

const BADGES: Record<number, BadgeDefinition> = {
  1: {
    id: "L1_SWAR_STARTER",
    level: 1,
    name: "Swar Starter",
    description: "Complete 10 L1 lessons + master 1",
    icon: "🎵",
    requirement: { type: "lessons_completed", lessonsNeeded: 10, masteredNeeded: 1 },
  },
  2: {
    id: "L2_MATRA_MASTER",
    level: 2,
    name: "Matra Master",
    description: "Complete 20 L2 lessons + master 3",
    icon: "🎨",
    requirement: { type: "lessons_completed", lessonsNeeded: 20, masteredNeeded: 3 },
  },
  3: {
    id: "L3_CONJUNCT_EXPLORER",
    level: 3,
    name: "Conjunct Explorer",
    description: "Complete 20 L3 lessons + master 3",
    icon: "🔗",
    requirement: { type: "lessons_completed", lessonsNeeded: 20, masteredNeeded: 3 },
  },
  4: {
    id: "L4_BARAKHADI_BUILDER",
    level: 4,
    name: "Barakhadi Builder",
    description: "Complete 25 L4 lessons + master 5",
    icon: "📋",
    requirement: { type: "lessons_completed", lessonsNeeded: 25, masteredNeeded: 5 },
  },
  5: {
    id: "L5_SENTENCE_READER",
    level: 5,
    name: "Sentence Reader",
    description: "Complete 10 L5 lessons + master 2",
    icon: "📖",
    requirement: { type: "lessons_completed", lessonsNeeded: 10, masteredNeeded: 2 },
  },
  6: {
    id: "L6_GRAMMAR_DETECTIVE",
    level: 6,
    name: "Grammar Detective",
    description: "Complete 15 L6 lessons + master 3",
    icon: "🔍",
    requirement: { type: "lessons_completed", lessonsNeeded: 15, masteredNeeded: 3 },
  },
};

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  PROFILE: "vaani_student_profile",
  COMPLETIONS: "vaani_lesson_completions",
};

// ============================================
// INITIALIZATION & STORAGE
// ============================================

/**
 * Generate a unique session-based student ID
 */
function generateStudentId(): string {
  return `student_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Initialize or fetch student game profile from localStorage
 */
export function getStudentGameProfile(): StudentGameProfile {
  if (typeof window === "undefined") {
    // Server-side: return empty profile
    return createEmptyProfile(generateStudentId());
  }

  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Corrupted data: reset
      console.warn("[Gamification] Corrupted profile data, resetting");
      const newProfile = createEmptyProfile(generateStudentId());
      saveProfile(newProfile);
      return newProfile;
    }
  }

  // New student
  const profile = createEmptyProfile(generateStudentId());
  saveProfile(profile);
  return profile;
}

/**
 * Create empty profile for new student
 */
function createEmptyProfile(studentId: string): StudentGameProfile {
  return {
    studentId,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: "",
    badgesEarned: Array.from({ length: 6 }, (_, i) => ({
      level: i + 1,
      badges: [],
    })),
    levelStats: Array.from({ length: 6 }, (_, i) => ({
      level: i + 1,
      totalLessons: 0,
      completedLessons: 0,
      masteredLessons: 0,
      totalXP: 0,
      badges: [],
    })),
  };
}

/**
 * Save profile to localStorage
 */
function saveProfile(profile: StudentGameProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }
}

/**
 * Get all completions for tracking history
 */
export function getAllCompletions(): LessonCompletion[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    console.warn("[Gamification] Corrupted completions data");
    return [];
  }
}

/**
 * Save completion record (append to array)
 */
function saveCompletion(completion: LessonCompletion): void {
  if (typeof window === "undefined") return;

  const completions = getAllCompletions();
  completions.push(completion);
  localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
}

/**
 * Get lesson completions for a specific lesson
 */
export function getLessonCompletions(lessonId: string): LessonCompletion[] {
  return getAllCompletions().filter((c) => c.lessonId === lessonId);
}

// ============================================
// XP CALCULATION
// ============================================

/**
 * Calculate XP earned for a lesson completion
 * Formula:
 *   BASE_XP = 20
 *   ACCURACY_BONUS = floor(accuracy / 10) → 0-10 XP
 *   NO_HINT_BONUS = (hintsUsed === 0) ? 5 : 0 → 0-5 XP
 *   REVIEW_BONUS = 10 XP (if revisiting a previously learned char)
 *   TOTAL = 20-55 XP
 */
function calculateXP(
  accuracy: number,
  hintsUsed: number,
  isReview: boolean
): number {
  const BASE_XP = 20;
  const accuracyBonus = Math.floor(accuracy / 10); // 0-10
  const noHintBonus = hintsUsed === 0 ? 5 : 0; // 0-5
  const reviewBonus = isReview ? 10 : 0; // 0-10

  return BASE_XP + accuracyBonus + noHintBonus + reviewBonus;
}

/**
 * Determine star rating (1-3) based on performance
 * 3 stars: accuracy >= 85% AND no hints used (or second attempt)
 * 2 stars: accuracy >= 70%
 * 1 star: accuracy >= 50% (lesson completed)
 */
function calculateStars(accuracy: number, hintsUsed: number): number {
  if (accuracy >= 85 && hintsUsed === 0) return 3;
  if (accuracy >= 70) return 2;
  return 1;
}

/**
 * Determine if lesson is mastered (3-star completion)
 */
function isMastered(accuracy: number, hintsUsed: number): boolean {
  return accuracy >= 85 && hintsUsed === 0;
}

// ============================================
// STREAK MANAGEMENT
// ============================================

/**
 * Update streak based on practice date
 * Returns: { currentStreak, comebackBonus }
 */
export function updateStreak(): { currentStreak: number; comebackBonus: boolean } {
  const profile = getStudentGameProfile();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  let comebackBonus = false;

  if (!profile.lastPracticeDate) {
    // First practice ever
    profile.currentStreak = 1;
    profile.longestStreak = 1;
  } else if (profile.lastPracticeDate === today) {
    // Already practiced today
    // Do nothing
  } else {
    // Different day
    const lastDate = new Date(profile.lastPracticeDate);
    const currentDate = new Date(today);
    const daysDiff = Math.floor(
      (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      // Consecutive day
      profile.currentStreak += 1;
      profile.longestStreak = Math.max(profile.currentStreak, profile.longestStreak);
    } else if (daysDiff > 1) {
      // Streak broken, but comeback reward on first practice
      profile.currentStreak = 1;
      comebackBonus = true;
    }
    // If daysDiff < 1: shouldn't happen (same day check above)
  }

  profile.lastPracticeDate = today;
  saveProfile(profile);

  return {
    currentStreak: profile.currentStreak,
    comebackBonus,
  };
}

// ============================================
// MAIN: AWARD XP & CHECK BADGES
// ============================================

/**
 * Called when student completes a lesson
 * Awards XP, updates streak, checks badge unlock
 * Returns: { xpAwarded, totalXP, newBadges }
 */
export function awardLessonXP(
  lessonId: string,
  level: number,
  accuracy: number,
  hintsUsed: number,
  isReview: boolean
): {
  xpAwarded: number;
  totalXP: number;
  newBadges: string[];
} {
  const profile = getStudentGameProfile();

  // Calculate XP
  const xpAwarded = calculateXP(accuracy, hintsUsed, isReview);
  const starsEarned = calculateStars(accuracy, hintsUsed);
  const mastered = isMastered(accuracy, hintsUsed);

  // Add comeback bonus if applicable
  const { comebackBonus } = updateStreak();
  const bonusXP = comebackBonus ? Math.floor(xpAwarded * 0.5) : 0; // 50% bonus
  const totalXpAwarded = xpAwarded + bonusXP;

  // Update profile
  profile.totalXP += totalXpAwarded;

  // Update level stats
  const levelStat = profile.levelStats.find((s) => s.level === level);
  if (levelStat) {
    levelStat.totalXP += totalXpAwarded;
    levelStat.completedLessons += 1;
    if (mastered) {
      levelStat.masteredLessons += 1;
    }
  }

  // Save completion record
  const completion: LessonCompletion = {
    lessonId,
    level,
    completedAt: new Date().toISOString(),
    xpEarned: totalXpAwarded,
    starsEarned,
    accuracy,
    hintsUsed,
    mastered,
  };
  saveCompletion(completion);

  // Check for badge unlock
  const newBadges = checkBadgeUnlock(level);
  if (newBadges.length > 0) {
    const badges = profile.badgesEarned.find((b) => b.level === level);
    if (badges) {
      badges.badges.push(...newBadges);
      levelStat!.badges = badges.badges;
    }
  }

  saveProfile(profile);

  return {
    xpAwarded: totalXpAwarded,
    totalXP: profile.totalXP,
    newBadges,
  };
}

/**
 * Check if any badges should be unlocked for this level
 * Returns: array of newly unlocked badge IDs
 */
export function checkBadgeUnlock(level: number): string[] {
  const profile = getStudentGameProfile();
  const levelStat = profile.levelStats.find((s) => s.level === level);
  if (!levelStat) return [];

  const badge = BADGES[level];
  if (!badge) return [];

  const alreadyEarned = profile.badgesEarned.find((b) => b.level === level)?.badges || [];
  if (alreadyEarned.includes(badge.id)) {
    // Already unlocked
    return [];
  }

  // Check unlock requirements
  const req = badge.requirement;
  if (
    req.lessonsNeeded &&
    levelStat.completedLessons >= req.lessonsNeeded &&
    (!req.masteredNeeded || levelStat.masteredLessons >= req.masteredNeeded)
  ) {
    return [badge.id];
  }

  return [];
}

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * Get stats for a specific level
 */
export function getLevelStats(level: number): {
  completedLessons: number;
  masteredLessons: number;
  totalXP: number;
  badges: string[];
  progressPercent: number;
  nextBadgeName?: string;
  nextBadgeIcon?: string;
} {
  const profile = getStudentGameProfile();
  const levelStat = profile.levelStats.find((s) => s.level === level);
  const badges = profile.badgesEarned.find((b) => b.level === level)?.badges || [];
  const badgeDef = BADGES[level];

  if (!levelStat) {
    return {
      completedLessons: 0,
      masteredLessons: 0,
      totalXP: 0,
      badges: [],
      progressPercent: 0,
    };
  }

  const progressPercent = Math.min(
    100,
    Math.round((levelStat.completedLessons / (badgeDef?.requirement.lessonsNeeded || 1)) * 100)
  );

  return {
    completedLessons: levelStat.completedLessons,
    masteredLessons: levelStat.masteredLessons,
    totalXP: levelStat.totalXP,
    badges,
    progressPercent,
    nextBadgeName: !badges.includes(badgeDef.id) ? badgeDef.name : undefined,
    nextBadgeIcon: !badges.includes(badgeDef.id) ? badgeDef.icon : undefined,
  };
}

/**
 * Get total profile stats
 */
export function getProfileStats(): {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalBadges: number;
} {
  const profile = getStudentGameProfile();
  const totalBadges = profile.badgesEarned.reduce((sum, b) => sum + b.badges.length, 0);

  return {
    totalXP: profile.totalXP,
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    totalBadges,
  };
}

/**
 * Clear all game data (debug/testing only)
 */
export function clearGameData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.COMPLETIONS);
    console.warn("[Gamification] All game data cleared");
  }
}
