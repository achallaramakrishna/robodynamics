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
@Table(name = "rd_ci_assessment_session")
public class RDCIAssessmentSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_assessment_session_id")
    private Long ciAssessmentSessionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ci_subscription_id", nullable = false)
    private RDCISubscription subscription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_user_id", nullable = false)
    private RDUser studentUser;

    @Column(name = "assessment_version", nullable = false)
    private String assessmentVersion;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "attempt_no", nullable = false)
    private Integer attemptNo;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiAssessmentSessionId() {
        return ciAssessmentSessionId;
    }

    public void setCiAssessmentSessionId(Long ciAssessmentSessionId) {
        this.ciAssessmentSessionId = ciAssessmentSessionId;
    }

    public RDCISubscription getSubscription() {
        return subscription;
    }

    public void setSubscription(RDCISubscription subscription) {
        this.subscription = subscription;
    }

    public RDUser getStudentUser() {
        return studentUser;
    }

    public void setStudentUser(RDUser studentUser) {
        this.studentUser = studentUser;
    }

    public String getAssessmentVersion() {
        return assessmentVersion;
    }

    public void setAssessmentVersion(String assessmentVersion) {
        this.assessmentVersion = assessmentVersion;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getAttemptNo() {
        return attemptNo;
    }

    public void setAttemptNo(Integer attemptNo) {
        this.attemptNo = attemptNo;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
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
