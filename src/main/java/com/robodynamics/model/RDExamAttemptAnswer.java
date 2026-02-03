package com.robodynamics.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "rd_exam_attempt_answers")
public class RDExamAttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_answer_id")
    private Integer attemptAnswerId;

    /* ================= RELATIONS ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private RDExamAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_section_question_id", nullable = false)
    private RDExamSectionQuestion sectionQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private RDQuizQuestion question;

    /* ================= ANSWER ================= */

    @Lob
    @Column(name = "student_answer_text")
    private String studentAnswerText;

    @Column(name = "student_answer_file")
    private String studentAnswerFile;

    /* ================= SCORE ================= */

    @Column(name = "score", precision = 6, scale = 2)
    private BigDecimal score;

    /* ================= AUDIT ================= */

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /* ================= GETTERS / SETTERS ================= */

    public Integer getAttemptAnswerId() {
        return attemptAnswerId;
    }

    public void setAttemptAnswerId(Integer attemptAnswerId) {
        this.attemptAnswerId = attemptAnswerId;
    }

    public RDExamAttempt getAttempt() {
        return attempt;
    }

    public void setAttempt(RDExamAttempt attempt) {
        this.attempt = attempt;
    }

    public RDExamSectionQuestion getSectionQuestion() {
        return sectionQuestion;
    }

    public void setSectionQuestion(RDExamSectionQuestion sectionQuestion) {
        this.sectionQuestion = sectionQuestion;
    }

    public RDQuizQuestion getQuestion() {
        return question;
    }

    public void setQuestion(RDQuizQuestion question) {
        this.question = question;
    }

    public String getStudentAnswerText() {
        return studentAnswerText;
    }

    public void setStudentAnswerText(String studentAnswerText) {
        this.studentAnswerText = studentAnswerText;
    }

    public String getStudentAnswerFile() {
        return studentAnswerFile;
    }

    public void setStudentAnswerFile(String studentAnswerFile) {
        this.studentAnswerFile = studentAnswerFile;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
