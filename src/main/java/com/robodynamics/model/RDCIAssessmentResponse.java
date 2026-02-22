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
@Table(name = "rd_ci_assessment_response")
public class RDCIAssessmentResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_assessment_response_id")
    private Long ciAssessmentResponseId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ci_assessment_session_id", nullable = false)
    private RDCIAssessmentSession assessmentSession;

    @Column(name = "question_code", nullable = false)
    private String questionCode;

    @Column(name = "selected_option")
    private String selectedOption;

    @Column(name = "response_json", columnDefinition = "json")
    private String responseJson;

    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    @Column(name = "confidence_level")
    private String confidenceLevel;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "score_awarded")
    private BigDecimal scoreAwarded;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiAssessmentResponseId() {
        return ciAssessmentResponseId;
    }

    public void setCiAssessmentResponseId(Long ciAssessmentResponseId) {
        this.ciAssessmentResponseId = ciAssessmentResponseId;
    }

    public RDCIAssessmentSession getAssessmentSession() {
        return assessmentSession;
    }

    public void setAssessmentSession(RDCIAssessmentSession assessmentSession) {
        this.assessmentSession = assessmentSession;
    }

    public String getQuestionCode() {
        return questionCode;
    }

    public void setQuestionCode(String questionCode) {
        this.questionCode = questionCode;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }

    public String getResponseJson() {
        return responseJson;
    }

    public void setResponseJson(String responseJson) {
        this.responseJson = responseJson;
    }

    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public BigDecimal getScoreAwarded() {
        return scoreAwarded;
    }

    public void setScoreAwarded(BigDecimal scoreAwarded) {
        this.scoreAwarded = scoreAwarded;
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
