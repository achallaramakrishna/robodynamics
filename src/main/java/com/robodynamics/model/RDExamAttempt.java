package com.robodynamics.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "rd_exam_attempts")
public class RDExamAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_id")
    private Integer attemptId;

    /* ================= RELATIONS ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_paper_id", nullable = false)
    private RDExamPaper examPaper;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private RDStudentEnrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private RDUser student;

    /* ================= TIMING ================= */

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    /* ================= STATUS ================= */

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    public enum AttemptStatus {
        IN_PROGRESS,
        SUBMITTED,
        EVALUATED
    }

    /* ================= SCORE ================= */

    @Column(name = "total_score", precision = 6, scale = 2)
    private BigDecimal totalScore;

    /* ================= AUDIT ================= */

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /* ================= LIFECYCLE ================= */

    @PrePersist
    protected void onCreate() {
        this.startTime = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /* ================= GETTERS / SETTERS ================= */

    public Integer getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Integer attemptId) {
        this.attemptId = attemptId;
    }

    public RDExamPaper getExamPaper() {
        return examPaper;
    }

    public void setExamPaper(RDExamPaper examPaper) {
        this.examPaper = examPaper;
    }

    public RDStudentEnrollment getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(RDStudentEnrollment enrollment) {
        this.enrollment = enrollment;
    }

    public RDUser getStudent() {
        return student;
    }

    public void setStudent(RDUser student) {
        this.student = student;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public AttemptStatus getStatus() {
        return status;
    }

    public void setStatus(AttemptStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(BigDecimal totalScore) {
        this.totalScore = totalScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
