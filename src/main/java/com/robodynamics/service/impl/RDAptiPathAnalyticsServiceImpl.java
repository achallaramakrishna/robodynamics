package com.robodynamics.service.impl;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCIAssessmentSessionDao;
import com.robodynamics.service.RDAptiPathAnalyticsService;
import com.robodynamics.service.RDCIScoreIndexService;
import com.robodynamics.service.RDCISubscriptionService;

@Service
public class RDAptiPathAnalyticsServiceImpl implements RDAptiPathAnalyticsService {

    @Autowired
    private RDCISubscriptionService ciSubscriptionService;

    @Autowired
    private RDCIAssessmentSessionDao ciAssessmentSessionDao;

    @Autowired
    private RDCIScoreIndexService ciScoreIndexService;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();

        long activeAptiPathSubscriptions = ciSubscriptionService.countActiveByModule("APTIPATH");
        long totalAssessmentSessions = ciAssessmentSessionDao.countAll();
        long createdSessions = ciAssessmentSessionDao.countByStatus("CREATED");
        long inProgressSessions = ciAssessmentSessionDao.countByStatus("IN_PROGRESS");
        long completedSessions = ciAssessmentSessionDao.countByStatus("COMPLETED");
        Double averageDurationSeconds = ciAssessmentSessionDao.averageDurationSecondsForCompleted();

        summary.put("activeAptiPathSubscriptions", activeAptiPathSubscriptions);
        summary.put("totalAssessmentSessions", totalAssessmentSessions);
        summary.put("createdSessions", createdSessions);
        summary.put("inProgressSessions", inProgressSessions);
        summary.put("completedSessions", completedSessions);
        summary.put("averageDurationSeconds", averageDurationSeconds == null ? 0D : averageDurationSeconds);
        summary.put("averageOverallFitScore", ciScoreIndexService.getAverageOverallFitScore());
        summary.put("averageAiReadinessIndex", ciScoreIndexService.getAverageAiReadinessIndex());
        summary.put("averageAlignmentIndex", ciScoreIndexService.getAverageAlignmentIndex());
        summary.put("averageWellbeingRiskIndex", ciScoreIndexService.getAverageWellbeingRiskIndex());
        summary.put("highWellbeingRiskSessions", ciScoreIndexService.countHighWellbeingRisk(70D));
        summary.put("lowAlignmentSessions", ciScoreIndexService.countLowAlignment(45D));
        return summary;
    }
}
