package com.robodynamics.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "rd_test_attempt")
public class RDTestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_id")
    private Integer attemptId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "test_id", nullable = false)
    private RDTest test;

    // FK to your enrollment table (kept as scalar for loose coupling)
    @Column(name = "enrollment_id", nullable = false)
    private Integer enrollmentId;

    @Column(name = "score_obtained", nullable = false, precision = 6, scale = 2)
    private BigDecimal scoreObtained;

    @Lob
    @Column(name = "feedback")
    private String feedback;

    @Column(name = "attempt_date")
    private LocalDate attemptDate;

    @Column(name = "attachment_path", length = 512)
    private String attachmentPath;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Getters & Setters

    public Integer getAttemptId() { return attemptId; }
    public void setAttemptId(Integer attemptId) { this.attemptId = attemptId; }

    public RDTest getTest() { return test; }
    public void setTest(RDTest test) { this.test = test; }

    public Integer getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(Integer enrollmentId) { this.enrollmentId = enrollmentId; }

    public BigDecimal getScoreObtained() { return scoreObtained; }
    public void setScoreObtained(BigDecimal scoreObtained) { this.scoreObtained = scoreObtained; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDate getAttemptDate() { return attemptDate; }
    public void setAttemptDate(LocalDate attemptDate) { this.attemptDate = attemptDate; }

    public String getAttachmentPath() { return attachmentPath; }
    public void setAttachmentPath(String attachmentPath) { this.attachmentPath = attachmentPath; }

    public Integer getCreatedBy() { return createdBy; }
    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
