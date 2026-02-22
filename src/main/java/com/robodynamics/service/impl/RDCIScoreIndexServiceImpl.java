package com.robodynamics.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCIAssessmentSessionDao;
import com.robodynamics.dao.RDCIScoreIndexDao;
import com.robodynamics.model.RDCIAssessmentSession;
import com.robodynamics.model.RDCIScoreIndex;
import com.robodynamics.service.RDCIScoreIndexService;

@Service
public class RDCIScoreIndexServiceImpl implements RDCIScoreIndexService {

    @Autowired
    private RDCIScoreIndexDao ciScoreIndexDao;

    @Autowired
    private RDCIAssessmentSessionDao ciAssessmentSessionDao;

    @Override
    @Transactional
    public RDCIScoreIndex saveOrUpdate(Long assessmentSessionId,
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
                                       Double wellbeingRiskIndex) {
        if (assessmentSessionId == null) {
            throw new IllegalArgumentException("assessmentSessionId is required.");
        }
        RDCIAssessmentSession assessmentSession = ciAssessmentSessionDao.findById(assessmentSessionId);
        if (assessmentSession == null) {
            throw new IllegalArgumentException("No assessment session found for id " + assessmentSessionId);
        }

        RDCIScoreIndex row = ciScoreIndexDao.findByAssessmentSessionId(assessmentSessionId);
        LocalDateTime now = LocalDateTime.now();
        if (row == null) {
            row = new RDCIScoreIndex();
            row.setAssessmentSession(assessmentSession);
            row.setCreatedAt(now);
        }

        row.setScoringVersion(isBlank(scoringVersion) ? "v1" : scoringVersion.trim());
        row.setAptitudeScore(toDecimal(aptitudeScore));
        row.setInterestScore(toDecimal(interestScore));
        row.setParentContextScore(toDecimal(parentContextScore));
        row.setOverallFitScore(toDecimal(overallFitScore));
        row.setPressureIndex(toDecimal(pressureIndex));
        row.setExplorationIndex(toDecimal(explorationIndex));
        row.setExamReadinessIndex(toDecimal(examReadinessIndex));
        row.setAiReadinessIndex(toDecimal(aiReadinessIndex));
        row.setAlignmentIndex(toDecimal(alignmentIndex));
        row.setWellbeingRiskIndex(toDecimal(wellbeingRiskIndex));
        row.setUpdatedAt(now);

        ciScoreIndexDao.save(row);
        return row;
    }

    @Override
    @Transactional(readOnly = true)
    public RDCIScoreIndex getByAssessmentSessionId(Long assessmentSessionId) {
        return ciScoreIndexDao.findByAssessmentSessionId(assessmentSessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public double getAverageOverallFitScore() {
        return defaultZero(ciScoreIndexDao.averageOverallFitScore());
    }

    @Override
    @Transactional(readOnly = true)
    public double getAverageAiReadinessIndex() {
        return defaultZero(ciScoreIndexDao.averageAiReadinessIndex());
    }

    @Override
    @Transactional(readOnly = true)
    public double getAverageAlignmentIndex() {
        return defaultZero(ciScoreIndexDao.averageAlignmentIndex());
    }

    @Override
    @Transactional(readOnly = true)
    public double getAverageWellbeingRiskIndex() {
        return defaultZero(ciScoreIndexDao.averageWellbeingRiskIndex());
    }

    @Override
    @Transactional(readOnly = true)
    public long countHighWellbeingRisk(double threshold) {
        Long count = ciScoreIndexDao.countByWellbeingRiskAtOrAbove(threshold);
        return count == null ? 0L : count;
    }

    @Override
    @Transactional(readOnly = true)
    public long countLowAlignment(double threshold) {
        Long count = ciScoreIndexDao.countByAlignmentAtOrBelow(threshold);
        return count == null ? 0L : count;
    }

    private BigDecimal toDecimal(Double value) {
        if (value == null) {
            return null;
        }
        double bounded = Math.max(0D, Math.min(100D, value));
        return BigDecimal.valueOf(bounded).setScale(2, RoundingMode.HALF_UP);
    }

    private double defaultZero(Double value) {
        return value == null ? 0D : value;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
