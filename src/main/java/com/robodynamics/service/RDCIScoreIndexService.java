package com.robodynamics.service;

import com.robodynamics.model.RDCIScoreIndex;

public interface RDCIScoreIndexService {

    RDCIScoreIndex saveOrUpdate(
            Long assessmentSessionId,
            String scoringVersion,
            Double aptitudeScore,
            Double interestScore,
            Double parentContextScore,
            Double overallFitScore,
            Double pressureIndex,
            Double explorationIndex,
            Double examReadinessIndex,
            Double aiReadinessIndex,
            Double alignmentIndex,
            Double wellbeingRiskIndex);

    RDCIScoreIndex getByAssessmentSessionId(Long assessmentSessionId);

    double getAverageOverallFitScore();

    double getAverageAiReadinessIndex();

    double getAverageAlignmentIndex();

    double getAverageWellbeingRiskIndex();

    long countHighWellbeingRisk(double threshold);

    long countLowAlignment(double threshold);
}
