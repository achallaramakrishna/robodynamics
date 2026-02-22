package com.robodynamics.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCIAssessmentSessionDao;
import com.robodynamics.dao.RDCIRecommendationSnapshotDao;
import com.robodynamics.model.RDCIAssessmentSession;
import com.robodynamics.model.RDCIRecommendationSnapshot;
import com.robodynamics.service.RDCIRecommendationService;

@Service
public class RDCIRecommendationServiceImpl implements RDCIRecommendationService {

    @Autowired
    private RDCIRecommendationSnapshotDao recommendationSnapshotDao;

    @Autowired
    private RDCIAssessmentSessionDao assessmentSessionDao;

    @Override
    @Transactional
    public RDCIRecommendationSnapshot saveSnapshot(
            Long assessmentSessionId,
            String recommendationVersion,
            String streamFitJson,
            String careerClustersJson,
            String planAJson,
            String planBJson,
            String planCJson,
            String summaryText) {

        if (assessmentSessionId == null) {
            throw new IllegalArgumentException("assessmentSessionId is required.");
        }
        RDCIAssessmentSession session = assessmentSessionDao.findById(assessmentSessionId);
        if (session == null) {
            throw new IllegalArgumentException("No assessment session found for id " + assessmentSessionId);
        }

        String resolvedVersion = isBlank(recommendationVersion) ? "v1" : recommendationVersion.trim();
        RDCIRecommendationSnapshot snapshot = recommendationSnapshotDao
                .findByAssessmentSessionIdAndVersion(assessmentSessionId, resolvedVersion);
        LocalDateTime now = LocalDateTime.now();
        if (snapshot == null) {
            snapshot = new RDCIRecommendationSnapshot();
            snapshot.setAssessmentSession(session);
            snapshot.setRecommendationVersion(resolvedVersion);
            snapshot.setCreatedAt(now);
        }

        snapshot.setStreamFitJson(trimToNull(streamFitJson));
        snapshot.setCareerClustersJson(trimToNull(careerClustersJson));
        snapshot.setPlanAJson(trimToNull(planAJson));
        snapshot.setPlanBJson(trimToNull(planBJson));
        snapshot.setPlanCJson(trimToNull(planCJson));
        snapshot.setSummaryText(trimToNull(summaryText));
        snapshot.setUpdatedAt(now);

        recommendationSnapshotDao.save(snapshot);
        return snapshot;
    }

    @Override
    @Transactional(readOnly = true)
    public RDCIRecommendationSnapshot getLatestByAssessmentSessionId(Long assessmentSessionId) {
        return recommendationSnapshotDao.findLatestByAssessmentSessionId(assessmentSessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCIRecommendationSnapshot> getByAssessmentSessionId(Long assessmentSessionId) {
        return recommendationSnapshotDao.findByAssessmentSessionId(assessmentSessionId);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
