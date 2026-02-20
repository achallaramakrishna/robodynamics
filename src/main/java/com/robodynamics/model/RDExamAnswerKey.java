package com.robodynamics.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(
    name = "rd_exam_answer_keys",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "exam_section_question_id")
    }
)
public class RDExamAnswerKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_key_id")
    private Integer answerKeyId;

    /* ================= RELATIONS ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_paper_id", nullable = false)
    private RDExamPaper examPaper;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "exam_section_question_id",
        nullable = false,
        unique = true
    )
    private RDExamSectionQuestion sectionQuestion;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private RDQuizQuestion question;

    /* ================= ANSWER KEY ================= */

    @Lob
    @Column(name = "model_answer", nullable = false)
    private String modelAnswer;

    @Column(name = "max_marks", precision = 6, scale = 2, nullable = false)
    private BigDecimal maxMarks;

    @Column(name = "key_points", columnDefinition = "json")
    private String keyPoints;

    @Column(name = "expected_keywords", columnDefinition = "json")
    private String expectedKeywords;

    /* ================= AUDIT ================= */

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /* ================= GETTERS / SETTERS ================= */

    public Integer getAnswerKeyId() {
        return answerKeyId;
    }

    public void setAnswerKeyId(Integer answerKeyId) {
        this.answerKeyId = answerKeyId;
    }

    public RDExamPaper getExamPaper() {
        return examPaper;
    }

    public void setExamPaper(RDExamPaper examPaper) {
        this.examPaper = examPaper;
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

    public String getModelAnswer() {
        return modelAnswer;
    }

    public void setModelAnswer(String modelAnswer) {
        this.modelAnswer = modelAnswer;
    }

    public BigDecimal getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(BigDecimal maxMarks) {
        this.maxMarks = maxMarks;
    }

    public String getKeyPoints() {
        return keyPoints;
    }

    public void setKeyPoints(String keyPoints) {
        this.keyPoints = keyPoints;
    }

    public String getExpectedKeywords() {
        return expectedKeywords;
    }

    public void setExpectedKeywords(String expectedKeywords) {
        this.expectedKeywords = expectedKeywords;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
