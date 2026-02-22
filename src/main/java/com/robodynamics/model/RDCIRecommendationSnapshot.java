package com.robodynamics.model;

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
@Table(name = "rd_ci_recommendation_snapshot")
public class RDCIRecommendationSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_recommendation_snapshot_id")
    private Long ciRecommendationSnapshotId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ci_assessment_session_id", nullable = false)
    private RDCIAssessmentSession assessmentSession;

    @Column(name = "recommendation_version", nullable = false)
    private String recommendationVersion;

    @Column(name = "stream_fit_json", columnDefinition = "json")
    private String streamFitJson;

    @Column(name = "career_clusters_json", columnDefinition = "json")
    private String careerClustersJson;

    @Column(name = "plan_a_json", columnDefinition = "json")
    private String planAJson;

    @Column(name = "plan_b_json", columnDefinition = "json")
    private String planBJson;

    @Column(name = "plan_c_json", columnDefinition = "json")
    private String planCJson;

    @Column(name = "summary_text")
    private String summaryText;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiRecommendationSnapshotId() {
        return ciRecommendationSnapshotId;
    }

    public void setCiRecommendationSnapshotId(Long ciRecommendationSnapshotId) {
        this.ciRecommendationSnapshotId = ciRecommendationSnapshotId;
    }

    public RDCIAssessmentSession getAssessmentSession() {
        return assessmentSession;
    }

    public void setAssessmentSession(RDCIAssessmentSession assessmentSession) {
        this.assessmentSession = assessmentSession;
    }

    public String getRecommendationVersion() {
        return recommendationVersion;
    }

    public void setRecommendationVersion(String recommendationVersion) {
        this.recommendationVersion = recommendationVersion;
    }

    public String getStreamFitJson() {
        return streamFitJson;
    }

    public void setStreamFitJson(String streamFitJson) {
        this.streamFitJson = streamFitJson;
    }

    public String getCareerClustersJson() {
        return careerClustersJson;
    }

    public void setCareerClustersJson(String careerClustersJson) {
        this.careerClustersJson = careerClustersJson;
    }

    public String getPlanAJson() {
        return planAJson;
    }

    public void setPlanAJson(String planAJson) {
        this.planAJson = planAJson;
    }

    public String getPlanBJson() {
        return planBJson;
    }

    public void setPlanBJson(String planBJson) {
        this.planBJson = planBJson;
    }

    public String getPlanCJson() {
        return planCJson;
    }

    public void setPlanCJson(String planCJson) {
        this.planCJson = planCJson;
    }

    public String getSummaryText() {
        return summaryText;
    }

    public void setSummaryText(String summaryText) {
        this.summaryText = summaryText;
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
