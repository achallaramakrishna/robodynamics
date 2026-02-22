package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCIRecommendationSnapshot;

public interface RDCIRecommendationSnapshotDao {

    void save(RDCIRecommendationSnapshot snapshot);

    List<RDCIRecommendationSnapshot> findByAssessmentSessionId(Long assessmentSessionId);

    RDCIRecommendationSnapshot findByAssessmentSessionIdAndVersion(Long assessmentSessionId, String recommendationVersion);

    RDCIRecommendationSnapshot findLatestByAssessmentSessionId(Long assessmentSessionId);
}
