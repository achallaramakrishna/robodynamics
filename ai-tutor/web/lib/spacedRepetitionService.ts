/**
 * Spaced Repetition Service
 * Reminds students of previously learned vowels during consonant lessons
 * Uses SM-2 algorithm concepts for optimal recall timing
 */

export interface LearningRecord {
  letterId: string; // e.g., "अ", "आ"
  lessonId: string; // e.g., "L1-C01-L01"
  learningDate: Date;
  successCount: number; // Times student correctly recognized it
  failureCount: number; // Times student missed it
  easeFactor: number; // SM-2 ease factor (default 2.5)
  nextReviewDate?: Date;
  lastReviewDate?: Date;
}

export interface RecallChallenge {
  type: 'vowel_recall' | 'consonant_compare' | 'word_match';
  promptLetterId: string; // Letter to recall
  learnedLessonId: string; // Where it was originally learned
  daysSinceLearning: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export class SpacedRepetitionService {
  private learningRecords: Map<string, LearningRecord> = new Map();
  private readonly SM2_BASE_EASINESS = 2.5;
  private readonly SM2_INTERVAL_MULTIPLIER = 1.3;

  /**
   * Record that student successfully learned a letter
   */
  recordLetterLearned(
    letterId: string,
    lessonId: string,
    timestamp: Date = new Date()
  ): void {
    const record: LearningRecord = {
      letterId,
      lessonId,
      learningDate: timestamp,
      successCount: 1,
      failureCount: 0,
      easeFactor: this.SM2_BASE_EASINESS,
      lastReviewDate: timestamp
    };

    this.learningRecords.set(letterId, record);
  }

  /**
   * Record successful comprehension check
   */
  recordSuccess(letterId: string): void {
    const record = this.learningRecords.get(letterId);
    if (!record) return;

    record.successCount++;
    record.lastReviewDate = new Date();

    // SM-2 algorithm: Calculate next review date
    const interval = this.calculateNextInterval(record);
    record.nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

    this.learningRecords.set(letterId, record);
  }

  /**
   * Record failed comprehension check
   */
  recordFailure(letterId: string): void {
    const record = this.learningRecords.get(letterId);
    if (!record) return;

    record.failureCount++;
    record.easeFactor = Math.max(1.3, record.easeFactor - 0.2); // Reduce ease
    record.nextReviewDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // Review tomorrow

    this.learningRecords.set(letterId, record);
  }

  /**
   * Get vowels that should be recalled in current consonant lesson
   * Returns vowels learned 2-7 days ago (optimal recall window)
   */
  getRecallChallengesForConsonantLesson(currentLessonDate: Date): RecallChallenge[] {
    const challenges: RecallChallenge[] = [];
    const RECALL_WINDOW_DAYS = { min: 2, max: 7 }; // Review vowels learned 2-7 days ago

    const vowelIds = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं'];

    vowelIds.forEach(vowelId => {
      const record = this.learningRecords.get(vowelId);
      if (!record) return;

      const daysSinceLearning = Math.floor(
        (currentLessonDate.getTime() - record.learningDate.getTime()) / (24 * 60 * 60 * 1000)
      );

      // Only include if in recall window and not failed recently
      if (daysSinceLearning >= RECALL_WINDOW_DAYS.min && daysSinceLearning <= RECALL_WINDOW_DAYS.max) {
        const difficulty = this.getDifficulty(record);

        challenges.push({
          type: 'vowel_recall',
          promptLetterId: vowelId,
          learnedLessonId: record.lessonId,
          daysSinceLearning,
          difficulty
        });
      }
    });

    return challenges.sort((a, b) => b.daysSinceLearning - a.daysSinceLearning);
  }

  /**
   * Get comparison challenges (e.g., compare two similar vowels)
   */
  getComparisonChallenges(currentLessonDate: Date): RecallChallenge[] {
    const challenges: RecallChallenge[] = [];

    // Pairs that are often confused
    const confusablePairs = [
      ['अ', 'आ'],
      ['इ', 'ई'],
      ['उ', 'ऊ']
    ];

    confusablePairs.forEach(([vowel1, vowel2]) => {
      const record1 = this.learningRecords.get(vowel1);
      const record2 = this.learningRecords.get(vowel2);

      if (record1 && record2) {
        const daysSinceEarlier = Math.floor(
          (currentLessonDate.getTime() - Math.min(
            record1.learningDate.getTime(),
            record2.learningDate.getTime()
          )) / (24 * 60 * 60 * 1000)
        );

        // Include if both are learned and older than 1 day
        if (daysSinceEarlier > 1 && daysSinceEarlier < 10) {
          challenges.push({
            type: 'vowel_recall',
            promptLetterId: `${vowel1}/${vowel2}`, // Both
            learnedLessonId: `${record1.lessonId}+${record2.lessonId}`,
            daysSinceLearning: daysSinceEarlier,
            difficulty: 'medium'
          });
        }
      }
    });

    return challenges;
  }

  /**
   * Determine difficulty based on success/failure history
   */
  private getDifficulty(record: LearningRecord): 'easy' | 'medium' | 'hard' {
    const total = record.successCount + record.failureCount;
    const failureRate = record.failureCount / total;

    if (failureRate > 0.3) return 'hard';
    if (failureRate > 0.1) return 'medium';
    return 'easy';
  }

  /**
   * Calculate next review interval using SM-2 algorithm
   */
  private calculateNextInterval(record: LearningRecord): number {
    const total = record.successCount + record.failureCount;
    if (total === 1) return 1; // First review after 1 day
    if (total === 2) return 3; // Second review after 3 days

    // Subsequent reviews use ease factor
    const previousInterval = record.nextReviewDate
      ? Math.floor(
        (record.nextReviewDate.getTime() - record.lastReviewDate!.getTime()) / (24 * 60 * 60 * 1000)
      )
      : 3;

    return Math.ceil(previousInterval * record.easeFactor);
  }

  /**
   * Get learning statistics for parent dashboard
   */
  getStatistics(): {
    totalLettersLearned: number;
    averageSuccessRate: number;
    needsReview: string[];
  } {
    const records = Array.from(this.learningRecords.values());

    const totalLettersLearned = records.length;
    const averageSuccessRate =
      records.length > 0
        ? records.reduce((sum, r) => sum + r.successCount / (r.successCount + r.failureCount), 0) /
        records.length
        : 0;

    const needsReview = records
      .filter(r => r.nextReviewDate && r.nextReviewDate <= new Date())
      .map(r => r.letterId);

    return {
      totalLettersLearned,
      averageSuccessRate,
      needsReview
    };
  }

  /**
   * Export learning data for persistence
   */
  exportData(): Record<string, LearningRecord> {
    const exported: Record<string, LearningRecord> = {};
    this.learningRecords.forEach((record, key) => {
      exported[key] = { ...record };
    });
    return exported;
  }

  /**
   * Import learning data from storage
   */
  importData(data: Record<string, LearningRecord>): void {
    Object.entries(data).forEach(([key, record]) => {
      this.learningRecords.set(key, {
        ...record,
        learningDate: new Date(record.learningDate),
        nextReviewDate: record.nextReviewDate ? new Date(record.nextReviewDate) : undefined,
        lastReviewDate: record.lastReviewDate ? new Date(record.lastReviewDate) : undefined
      });
    });
  }
}

// Export singleton instance
export const spacedRepetitionService = new SpacedRepetitionService();
