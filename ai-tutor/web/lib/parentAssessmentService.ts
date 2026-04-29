/**
 * Parent Assessment Tool
 * Tracks which letters child struggles with
 * Provides insights for parent coaching
 */

export interface LetterAssessment {
  letterId: string; // e.g., "अ"
  lessonId: string;
  letterName: string; // e.g., "Anar"
  category: 'vowel' | 'consonant';

  // Performance metrics
  totalAttempts: number;
  correctAttempts: number;
  recognitionAccuracy: number; // 0-1
  pronunciationAttempts: number;
  writingAttempts: number;
  writingQuality: number; // 0-1 based on tracing

  // Timing
  timeSpentMs: number;
  averageTimePerAttemptMs: number;
  lastAttemptDate: Date;

  // Struggle indicators
  confidenceLevel: 'high' | 'medium' | 'low'; // Based on accuracy
  needsExtraSupport: boolean;
  suggestedFocusArea: 'recognition' | 'pronunciation' | 'writing' | 'none';

  // Parent notes
  parentNotes?: string;
  recommendedPractices: string[];
}

export interface ParentProgressReport {
  studentName: string;
  reportDate: Date;
  overallProgress: number; // 0-100%
  masteriesAchieved: string[]; // Letters fully mastered
  needsSupport: string[]; // Letters struggling with
  strengths: string[];
  challenges: string[];
  weeklyRecommendations: string[];
  nextMilestones: string[];
}

export interface StruggleIndicator {
  letter: string;
  reason: 'confusion_with_similar' | 'pronunciation_difficulty' | 'writing_difficulty' | 'low_confidence';
  severity: 'minor' | 'moderate' | 'significant';
  suggestions: string[];
}

export class ParentAssessmentService {
  private assessments: Map<string, LetterAssessment> = new Map();
  private readonly MASTERY_THRESHOLD = 0.8; // 80% to be considered mastered
  private readonly STRUGGLE_THRESHOLD = 0.6; // Below 60% needs support

  /**
   * Initialize assessment for a new letter
   */
  initializeLetterAssessment(
    letterId: string,
    lessonId: string,
    letterName: string,
    category: 'vowel' | 'consonant'
  ): void {
    if (this.assessments.has(letterId)) return; // Already initialized

    const assessment: LetterAssessment = {
      letterId,
      lessonId,
      letterName,
      category,
      totalAttempts: 0,
      correctAttempts: 0,
      recognitionAccuracy: 0,
      pronunciationAttempts: 0,
      writingAttempts: 0,
      writingQuality: 0,
      timeSpentMs: 0,
      averageTimePerAttemptMs: 0,
      lastAttemptDate: new Date(),
      confidenceLevel: 'low',
      needsExtraSupport: false,
      suggestedFocusArea: 'none',
      recommendedPractices: []
    };

    this.assessments.set(letterId, assessment);
  }

  /**
   * Record recognition/comprehension check attempt
   */
  recordRecognitionAttempt(
    letterId: string,
    isCorrect: boolean,
    timeMs: number
  ): void {
    const assessment = this.assessments.get(letterId);
    if (!assessment) return;

    assessment.totalAttempts++;
    if (isCorrect) assessment.correctAttempts++;
    assessment.recognitionAccuracy = assessment.correctAttempts / assessment.totalAttempts;
    assessment.timeSpentMs += timeMs;
    assessment.averageTimePerAttemptMs = assessment.timeSpentMs / assessment.totalAttempts;
    assessment.lastAttemptDate = new Date();

    this.updateConfidenceLevel(assessment);
    this.updateRecommendations(assessment);

    this.assessments.set(letterId, assessment);
  }

  /**
   * Record pronunciation attempt
   */
  recordPronunciationAttempt(
    letterId: string,
    quality: number, // 0-1 rating
    timeMs: number
  ): void {
    const assessment = this.assessments.get(letterId);
    if (!assessment) return;

    assessment.pronunciationAttempts++;
    // Incorporate into overall accuracy
    const oldAccuracy = assessment.recognitionAccuracy;
    assessment.recognitionAccuracy = (oldAccuracy * (assessment.totalAttempts - 1) + quality) / assessment.totalAttempts;
    assessment.timeSpentMs += timeMs;
    assessment.lastAttemptDate = new Date();

    this.updateConfidenceLevel(assessment);
    this.assessments.set(letterId, assessment);
  }

  /**
   * Record writing/tracing attempt
   */
  recordWritingAttempt(
    letterId: string,
    quality: number, // 0-1 based on accuracy of trace
    timeMs: number
  ): void {
    const assessment = this.assessments.get(letterId);
    if (!assessment) return;

    assessment.writingAttempts++;
    // Weighted average (recent attempts weighted more)
    assessment.writingQuality = (assessment.writingQuality * (assessment.writingAttempts - 1) + quality) / assessment.writingAttempts;
    assessment.timeSpentMs += timeMs;
    assessment.lastAttemptDate = new Date();

    this.updateConfidenceLevel(assessment);
    this.updateRecommendations(assessment);

    this.assessments.set(letterId, assessment);
  }

  /**
   * Identify which letters the child is struggling with
   */
  identifyStruggleLetters(): StruggleIndicator[] {
    const struggles: StruggleIndicator[] = [];

    this.assessments.forEach((assessment, letterId) => {
      if (assessment.recognitionAccuracy < this.STRUGGLE_THRESHOLD) {
        let reason: StruggleIndicator['reason'] = 'low_confidence';
        let severity: StruggleIndicator['severity'] = 'minor';

        if (assessment.recognitionAccuracy < 0.4) {
          severity = 'significant';
          reason = 'confusion_with_similar';
        } else if (assessment.recognitionAccuracy < 0.6) {
          severity = 'moderate';
        }

        const suggestions = this.generateSuggestions(assessment);

        struggles.push({
          letter: letterId,
          reason,
          severity,
          suggestions
        });
      }
    });

    return struggles.sort((a, b) => {
      const severityOrder = { 'significant': 0, 'moderate': 1, 'minor': 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Get parent progress report
   */
  generateParentReport(studentName: string): ParentProgressReport {
    const masteriesAchieved: string[] = [];
    const needsSupport: string[] = [];
    const struggles = this.identifyStruggleLetters();

    this.assessments.forEach((assessment, letterId) => {
      if (assessment.recognitionAccuracy >= this.MASTERY_THRESHOLD) {
        masteriesAchieved.push(`${letterId} (${assessment.letterName})`);
      }
      if (assessment.recognitionAccuracy < this.STRUGGLE_THRESHOLD) {
        needsSupport.push(`${letterId} (${assessment.letterName}) - ${(assessment.recognitionAccuracy * 100).toFixed(0)}% accuracy`);
      }
    });

    const totalAssessments = this.assessments.size;
    const overallProgress = totalAssessments > 0
      ? (Array.from(this.assessments.values()).reduce((sum, a) => sum + a.recognitionAccuracy, 0) / totalAssessments) * 100
      : 0;

    const strengths = this.identifyStrengths();
    const challenges = struggles.map(s => `Struggling with ${s.letter}: ${s.reason}`);
    const weeklyRecommendations = this.generateWeeklyRecommendations();
    const nextMilestones = this.identifyNextMilestones();

    return {
      studentName,
      reportDate: new Date(),
      overallProgress,
      masteriesAchieved,
      needsSupport,
      strengths,
      challenges,
      weeklyRecommendations,
      nextMilestones
    };
  }

  /**
   * Update confidence level based on performance
   */
  private updateConfidenceLevel(assessment: LetterAssessment): void {
    if (assessment.recognitionAccuracy >= 0.8) {
      assessment.confidenceLevel = 'high';
      assessment.needsExtraSupport = false;
    } else if (assessment.recognitionAccuracy >= 0.6) {
      assessment.confidenceLevel = 'medium';
      assessment.needsExtraSupport = false;
    } else {
      assessment.confidenceLevel = 'low';
      assessment.needsExtraSupport = true;
    }
  }

  /**
   * Update recommendations based on performance
   */
  private updateRecommendations(assessment: LetterAssessment): void {
    const practices: string[] = [];

    // Recognition struggles
    if (assessment.recognitionAccuracy < 0.7) {
      practices.push(`Practice recognizing ${assessment.letterId} among similar letters`);
      assessment.suggestedFocusArea = 'recognition';
    }

    // Writing struggles
    if (assessment.writingQuality < 0.7 && assessment.writingAttempts > 0) {
      practices.push(`Trace ${assessment.letterId} slowly and repeatedly`);
      assessment.suggestedFocusArea = 'writing';
    }

    // Time-based recommendations
    if (assessment.averageTimePerAttemptMs > 3000) {
      practices.push(`${assessment.letterId} takes longer to process - practice more frequently`);
    }

    assessment.recommendedPractices = practices;
  }

  /**
   * Generate personalized suggestions for struggling letters
   */
  private generateSuggestions(assessment: LetterAssessment): string[] {
    const suggestions: string[] = [];

    if (assessment.recognitionAccuracy < 0.5) {
      suggestions.push(`Practice comparing ${assessment.letterId} with similar letters`);
      suggestions.push(`Use the mouth position guide for ${assessment.letterId}`);
      suggestions.push(`Try the spaced repetition review for ${assessment.letterId}`);
    }

    if (assessment.writingQuality < 0.5 && assessment.writingAttempts > 0) {
      suggestions.push(`Trace ${assessment.letterId} on paper daily`);
      suggestions.push(`Say the sound while writing to strengthen memory`);
      suggestions.push(`Practice the stroke sequence slowly`);
    }

    if (assessment.timeSpentMs / assessment.totalAttempts > 2000) {
      suggestions.push(`Take breaks and return to ${assessment.letterId} later`);
      suggestions.push(`Use repetition games to speed up recognition`);
    }

    return suggestions.length > 0
      ? suggestions
      : ["Keep practicing regularly - you're on the right track!"];
  }

  /**
   * Identify strengths
   */
  private identifyStrengths(): string[] {
    const strengths: string[] = [];

    this.assessments.forEach((assessment, letterId) => {
      if (assessment.recognitionAccuracy >= 0.9) {
        strengths.push(`Excellent mastery of ${letterId} (${assessment.letterName})`);
      }
    });

    // Fast learners
    const fastLearners = Array.from(this.assessments.values())
      .filter(a => a.averageTimePerAttemptMs < 1000 && a.totalAttempts > 2);

    if (fastLearners.length > 0) {
      strengths.push(`Quick recognition of multiple letters`);
    }

    return strengths.length > 0 ? strengths : ['Consistent effort and engagement'];
  }

  /**
   * Generate weekly recommendations
   */
  private generateWeeklyRecommendations(): string[] {
    return [
      'Practice letters that need support for 2-3 minutes daily',
      'Use the mouth position guides to understand articulation',
      'Play letter matching games for recognition speed',
      'Celebrate mastered letters with your child',
      'Use the spaced repetition reviews to maintain knowledge'
    ];
  }

  /**
   * Identify next milestones
   */
  private identifyNextMilestones(): string[] {
    const milestones: string[] = [];
    const masterCount = Array.from(this.assessments.values()).filter(a => a.recognitionAccuracy >= this.MASTERY_THRESHOLD).length;

    if (masterCount >= 12) {
      milestones.push('All vowels mastered! Ready for consonants');
    }

    if (masterCount >= 20) {
      milestones.push('All major letters mastered! Ready for syllable formation (Level 2)');
    }

    if (masterCount >= 5) {
      milestones.push(`${masterCount} letters mastered - great progress!`);
    }

    return milestones.length > 0
      ? milestones
      : ['Complete more lessons to unlock milestones'];
  }

  /**
   * Export assessment data
   */
  exportData(): Record<string, LetterAssessment> {
    const exported: Record<string, LetterAssessment> = {};
    this.assessments.forEach((assessment, key) => {
      exported[key] = { ...assessment };
    });
    return exported;
  }

  /**
   * Import assessment data
   */
  importData(data: Record<string, LetterAssessment>): void {
    Object.entries(data).forEach(([key, assessment]) => {
      this.assessments.set(key, {
        ...assessment,
        lastAttemptDate: new Date(assessment.lastAttemptDate)
      });
    });
  }
}

// Export singleton instance
export const parentAssessmentService = new ParentAssessmentService();
