package com.robodynamics.dto;

public class AIEvaluationItem {

    private Integer questionId;
    private Double marksAwarded;
    private Double confidence;
    private String feedback;

    /* ================= GETTERS & SETTERS ================= */

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public Double getMarksAwarded() {
        return marksAwarded;
    }

    public void setMarksAwarded(Double marksAwarded) {
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
}
