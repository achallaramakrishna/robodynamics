package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCIRecommendationSnapshot;

public interface RDCIRecommendationService {

    RDCIRecommendationSnapshot saveSnapshot(
            Long assessmentSessionId,
            String recommendationVersion,
            String streamFitJson,
            String careerClustersJson,
            String planAJson,
            String planBJson,
            String planCJson,
            String summaryText);

    RDCIRecommendationSnapshot getLatestByAssessmentSessionId(Long assessmentSessionId);

    List<RDCIRecommendationSnapshot> getByAssessmentSessionId(Long assessmentSessionId);
}
