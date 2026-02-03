package com.robodynamics.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "rd_exam_ai_evaluations",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"submission_id", "exam_section_question_id"}
        )
    }
)
public class RDExamAIEvaluation {

    /* ================= PRIMARY KEY ================= */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ai_eval_id")
    private Long aiEvalId;

    /* ================= RELATIONS ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private RDExamSubmission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_section_question_id", nullable = false)
    private RDExamSectionQuestion sectionQuestion;

    /* ================= ORDERING ================= */

    @Column(name = "question_order", nullable = false)
    private Integer questionOrder;

    /* ================= AI RESULT ================= */

    @Column(name = "marks_awarded", precision = 6, scale = 2, nullable = false)
    private BigDecimal marksAwarded;

    @Column(name = "confidence", precision = 3, scale = 2)
    private Double confidence;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    /* ================= AUDIT ================= */

    @Column(name = "evaluated_by", nullable = false)
    private String evaluatedBy = "AI";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /* ================= GETTERS & SETTERS ================= */

    public Long getAiEvalId() {
        return aiEvalId;
    }

    public void setAiEvalId(Long aiEvalId) {
        this.aiEvalId = aiEvalId;
    }

    public RDExamSubmission getSubmission() {
        return submission;
    }

    public void setSubmission(RDExamSubmission submission) {
        this.submission = submission;
    }

    public RDExamSectionQuestion getSectionQuestion() {
        return sectionQuestion;
    }

    public void setSectionQuestion(RDExamSectionQuestion sectionQuestion) {
        this.sectionQuestion = sectionQuestion;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(Integer questionOrder) {
        this.questionOrder = questionOrder;
    }

    public BigDecimal getMarksAwarded() {
        return marksAwarded;
    }

    public void setMarksAwarded(BigDecimal marksAwarded) {
        this.marksAwarded = marksAwarded;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
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
}
