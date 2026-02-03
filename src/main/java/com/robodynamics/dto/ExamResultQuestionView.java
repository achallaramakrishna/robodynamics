package com.robodynamics.dto;

public class ExamResultQuestionView {

    private Integer questionId;
    private String questionText;

    private Double marksAwarded;
    private Integer maxMarks;

    private Double confidence;
    private String feedback;

    /* UI helpers */
    private boolean needsReview;

    // getters & setters

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public Double getMarksAwarded() {
        return marksAwarded;
    }

    public void setMarksAwarded(Double marksAwarded) {
        this.marksAwarded = marksAwarded;
    }

    public Integer getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
        this.needsReview = confidence != null && confidence < 0.6;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public boolean isNeedsReview() {
        return needsReview;
    }
}
