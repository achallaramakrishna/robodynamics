package com.robodynamics.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_ci_score_index")
public class RDCIScoreIndex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_score_index_id")
    private Long ciScoreIndexId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ci_assessment_session_id", nullable = false)
    private RDCIAssessmentSession assessmentSession;

    @Column(name = "aptitude_score")
    private BigDecimal aptitudeScore;

    @Column(name = "interest_score")
    private BigDecimal interestScore;

    @Column(name = "parent_context_score")
    private BigDecimal parentContextScore;

    @Column(name = "overall_fit_score")
    private BigDecimal overallFitScore;

    @Column(name = "pressure_index")
    private BigDecimal pressureIndex;

    @Column(name = "exploration_index")
    private BigDecimal explorationIndex;

    @Column(name = "exam_readiness_index")
    private BigDecimal examReadinessIndex;

    @Column(name = "ai_readiness_index")
    private BigDecimal aiReadinessIndex;

    @Column(name = "alignment_index")
    private BigDecimal alignmentIndex;

    @Column(name = "wellbeing_risk_index")
    private BigDecimal wellbeingRiskIndex;

    @Column(name = "scoring_version", nullable = false)
    private String scoringVersion;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiScoreIndexId() {
        return ciScoreIndexId;
    }

    public void setCiScoreIndexId(Long ciScoreIndexId) {
        this.ciScoreIndexId = ciScoreIndexId;
    }

    public RDCIAssessmentSession getAssessmentSession() {
        return assessmentSession;
    }

    public void setAssessmentSession(RDCIAssessmentSession assessmentSession) {
        this.assessmentSession = assessmentSession;
    }

    public BigDecimal getAptitudeScore() {
        return aptitudeScore;
    }

    public void setAptitudeScore(BigDecimal aptitudeScore) {
        this.aptitudeScore = aptitudeScore;
    }

    public BigDecimal getInterestScore() {
        return interestScore;
    }

    public void setInterestScore(BigDecimal interestScore) {
        this.interestScore = interestScore;
    }

    public BigDecimal getParentContextScore() {
        return parentContextScore;
    }

    public void setParentContextScore(BigDecimal parentContextScore) {
        this.parentContextScore = parentContextScore;
    }

    public BigDecimal getOverallFitScore() {
        return overallFitScore;
    }

    public void setOverallFitScore(BigDecimal overallFitScore) {
        this.overallFitScore = overallFitScore;
    }

    public BigDecimal getPressureIndex() {
        return pressureIndex;
    }

    public void setPressureIndex(BigDecimal pressureIndex) {
        this.pressureIndex = pressureIndex;
    }

    public BigDecimal getExplorationIndex() {
        return explorationIndex;
    }

    public void setExplorationIndex(BigDecimal explorationIndex) {
        this.explorationIndex = explorationIndex;
    }

    public BigDecimal getExamReadinessIndex() {
        return examReadinessIndex;
    }

    public void setExamReadinessIndex(BigDecimal examReadinessIndex) {
        this.examReadinessIndex = examReadinessIndex;
    }

    public BigDecimal getAiReadinessIndex() {
        return aiReadinessIndex;
    }

    public void setAiReadinessIndex(BigDecimal aiReadinessIndex) {
        this.aiReadinessIndex = aiReadinessIndex;
    }

    public BigDecimal getAlignmentIndex() {
        return alignmentIndex;
    }

    public void setAlignmentIndex(BigDecimal alignmentIndex) {
        this.alignmentIndex = alignmentIndex;
    }

    public BigDecimal getWellbeingRiskIndex() {
        return wellbeingRiskIndex;
    }

    public void setWellbeingRiskIndex(BigDecimal wellbeingRiskIndex) {
        this.wellbeingRiskIndex = wellbeingRiskIndex;
    }

    public String getScoringVersion() {
        return scoringVersion;
    }

    public void setScoringVersion(String scoringVersion) {
        this.scoringVersion = scoringVersion;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
