package com.robodynamics.dto;

import java.math.BigDecimal;

public class ExamQuestionResultRow {

    /* ================= META ================= */
    private Integer questionId;       // ✅ NEW
    private String questionType;      // ✅ NEW

    /* ================= SECTION ================= */
    private String sectionName;

    /* ================= QUESTION ================= */
    private String questionText;

    /* ================= MARKS ================= */
    private BigDecimal maxMarks;
    private BigDecimal marksAwarded;

    /* ================= ANSWERS ================= */
    private String studentAnswer;
    private String modelAnswer;

    /* ================= FEEDBACK ================= */
    private String feedback;

    public ExamQuestionResultRow() {}

    /**
     * ✅ Native SQL / JPQL safe constructor
     * Order must match SELECT clause
     */
    public ExamQuestionResultRow(
            Number questionId,
            String questionType,
            String sectionName,
            String questionText,
            Number maxMarks,
            Number marksAwarded,
            String feedback,
            String studentAnswer,
            String modelAnswer
    ) {
        this.questionId = questionId != null ? questionId.intValue() : null;
        this.questionType = questionType;
        this.sectionName = sectionName;
        this.questionText = questionText;
        this.maxMarks = toBigDecimal(maxMarks);
        this.marksAwarded = toBigDecimal(marksAwarded);
        this.feedback = feedback;
        this.studentAnswer = studentAnswer;
        this.modelAnswer = modelAnswer;
    }

    private static BigDecimal toBigDecimal(Number n) {
        return (n == null) ? null : new BigDecimal(n.toString());
    }

    /* ================= GETTERS / SETTERS ================= */

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public BigDecimal getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(BigDecimal maxMarks) {
        this.maxMarks = maxMarks;
    }

    public BigDecimal getMarksAwarded() {
        return marksAwarded;
    }

    public void setMarksAwarded(BigDecimal marksAwarded) {
        this.marksAwarded = marksAwarded;
    }

    public String getStudentAnswer() {
        return studentAnswer;
    }

    public void setStudentAnswer(String studentAnswer) {
        this.studentAnswer = studentAnswer;
    }

    public String getModelAnswer() {
        return modelAnswer;
    }

    public void setModelAnswer(String modelAnswer) {
        this.modelAnswer = modelAnswer;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
