package com.robodynamics.dao;

import com.robodynamics.model.RDCIScoreIndex;

public interface RDCIScoreIndexDao {

    void save(RDCIScoreIndex scoreIndex);

    RDCIScoreIndex findByAssessmentSessionId(Long assessmentSessionId);

    Double averageOverallFitScore();

    Double averageAiReadinessIndex();

    Double averageAlignmentIndex();

    Double averageWellbeingRiskIndex();

    Long countByWellbeingRiskAtOrAbove(double threshold);

    Long countByAlignmentAtOrBelow(double threshold);
}
