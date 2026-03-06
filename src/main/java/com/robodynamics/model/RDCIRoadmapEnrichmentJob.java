package com.robodynamics.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_ci_roadmap_enrichment_job")
public class RDCIRoadmapEnrichmentJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_roadmap_enrichment_job_id")
    private Long ciRoadmapEnrichmentJobId;

    @Column(name = "module_code", nullable = false)
    private String moduleCode;

    @Column(name = "assessment_version", nullable = false)
    private String assessmentVersion;

    @Column(name = "career_code", nullable = false)
    private String careerCode;

    @Column(name = "plan_tier", nullable = false)
    private String planTier;

    @Column(name = "grade_stage", nullable = false)
    private String gradeStage;

    @Column(name = "source_session_id")
    private Long sourceSessionId;

    @Column(name = "priority", nullable = false)
    private Integer priority;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "attempts", nullable = false)
    private Integer attempts;

    @Column(name = "max_attempts", nullable = false)
    private Integer maxAttempts;

    @Column(name = "next_attempt_at", nullable = false)
    private LocalDateTime nextAttemptAt;

    @Column(name = "last_error")
    private String lastError;

    @Column(name = "lock_owner")
    private String lockOwner;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "payload_json")
    private String payloadJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiRoadmapEnrichmentJobId() {
        return ciRoadmapEnrichmentJobId;
    }

    public void setCiRoadmapEnrichmentJobId(Long ciRoadmapEnrichmentJobId) {
        this.ciRoadmapEnrichmentJobId = ciRoadmapEnrichmentJobId;
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    public String getAssessmentVersion() {
        return assessmentVersion;
    }

    public void setAssessmentVersion(String assessmentVersion) {
        this.assessmentVersion = assessmentVersion;
    }

    public String getCareerCode() {
        return careerCode;
    }

    public void setCareerCode(String careerCode) {
        this.careerCode = careerCode;
    }

    public String getPlanTier() {
        return planTier;
    }

    public void setPlanTier(String planTier) {
        this.planTier = planTier;
    }

    public String getGradeStage() {
        return gradeStage;
    }

    public void setGradeStage(String gradeStage) {
        this.gradeStage = gradeStage;
    }

    public Long getSourceSessionId() {
        return sourceSessionId;
    }

    public void setSourceSessionId(Long sourceSessionId) {
        this.sourceSessionId = sourceSessionId;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public LocalDateTime getNextAttemptAt() {
        return nextAttemptAt;
    }

    public void setNextAttemptAt(LocalDateTime nextAttemptAt) {
        this.nextAttemptAt = nextAttemptAt;
    }

    public String getLastError() {
        return lastError;
    }

    public void setLastError(String lastError) {
        this.lastError = lastError;
    }

    public String getLockOwner() {
        return lockOwner;
    }

    public void setLockOwner(String lockOwner) {
        this.lockOwner = lockOwner;
    }

    public LocalDateTime getLockedAt() {
        return lockedAt;
    }

    public void setLockedAt(LocalDateTime lockedAt) {
        this.lockedAt = lockedAt;
    }

    public String getPayloadJson() {
        return payloadJson;
    }

    public void setPayloadJson(String payloadJson) {
        this.payloadJson = payloadJson;
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
