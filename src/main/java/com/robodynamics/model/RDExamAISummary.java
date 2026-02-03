package com.robodynamics.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_exam_ai_summary")
public class RDExamAISummary {

    /* ================= PRIMARY KEY ================= */

    @Id
    @Column(name = "submission_id")
    private Integer submissionId;

    /* ================= RELATION ================= */

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "submission_id")
    private RDExamSubmission submission;

    /* ================= AI SUMMARY ================= */

    @Column(name = "total_marks", precision = 6, scale = 2, nullable = false)
    private BigDecimal totalMarks;

    @Column(name = "overall_feedback", columnDefinition = "TEXT")
    private String overallFeedback;

    @Column(name = "evaluated_by", nullable = false)
    private String evaluatedBy = "AI";

    /* ================= AUDIT ================= */

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /* ================= GETTERS & SETTERS ================= */

    public Integer getSubmissionId() {
        return submissionId;
    }

    public RDExamSubmission getSubmission() {
        return submission;
    }

    public void setSubmission(RDExamSubmission submission) {
        this.submission = submission;
        this.submissionId = submission.getSubmissionId();
    }

    public BigDecimal getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(BigDecimal totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getOverallFeedback() {
        return overallFeedback;
    }

    public void setOverallFeedback(String overallFeedback) {
        this.overallFeedback = overallFeedback;
    }

    public String getEvaluatedBy() {
        return evaluatedBy;
    }

    public void setEvaluatedBy(String evaluatedBy) {
        this.evaluatedBy = evaluatedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
