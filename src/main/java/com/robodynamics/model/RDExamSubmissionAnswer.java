package com.robodynamics.model;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rd_exam_submission_answer")
public class RDExamSubmissionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_answer_id")
    private Integer submissionAnswerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private RDExamSubmission submission;

    @Column(name = "section_question_id", nullable = false)
    private Integer sectionQuestionId;

    @Lob
    @Column(name = "answer_text")
    private String answerText;

    @Column(name = "marks_awarded", precision = 5, scale = 2)
    private BigDecimal marksAwarded;

    @Column(name = "feedback")
    private String feedback;

    @Enumerated(EnumType.STRING)
    @Column(name = "evaluation_mode")
    private EvaluationMode evaluationMode = EvaluationMode.MANUAL;

    public enum EvaluationMode {
        AUTO,
        MANUAL,
        AI
    }

    /* ================= Getters & Setters ================= */

    public Integer getSubmissionAnswerId() {
        return submissionAnswerId;
    }

    public void setSubmissionAnswerId(Integer submissionAnswerId) {
        this.submissionAnswerId = submissionAnswerId;
    }

    public RDExamSubmission getSubmission() {
        return submission;
    }

    public void setSubmission(RDExamSubmission submission) {
        this.submission = submission;
    }

    public Integer getSectionQuestionId() {
        return sectionQuestionId;
    }

    public void setSectionQuestionId(Integer sectionQuestionId) {
        this.sectionQuestionId = sectionQuestionId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public BigDecimal getMarksAwarded() {
        return marksAwarded;
    }

    public void setMarksAwarded(BigDecimal marksAwarded) {
        this.marksAwarded = marksAwarded;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public EvaluationMode getEvaluationMode() {
        return evaluationMode;
    }

    public void setEvaluationMode(EvaluationMode evaluationMode) {
        this.evaluationMode = evaluationMode;
    }
}
