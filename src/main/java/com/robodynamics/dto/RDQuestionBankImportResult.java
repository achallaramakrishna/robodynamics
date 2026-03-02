package com.robodynamics.dto;

public class RDQuestionBankImportResult {

    private Integer courseId;
    private Integer sessionId;
    private Integer sessionDetailId;
    private int totalQuestions;
    private int createdQuestions;
    private int skippedQuestions;

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getSessionId() {
        return sessionId;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    public Integer getSessionDetailId() {
        return sessionDetailId;
    }

    public void setSessionDetailId(Integer sessionDetailId) {
        this.sessionDetailId = sessionDetailId;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCreatedQuestions() {
        return createdQuestions;
    }

    public void setCreatedQuestions(int createdQuestions) {
        this.createdQuestions = createdQuestions;
    }

    public int getSkippedQuestions() {
        return skippedQuestions;
    }

    public void setSkippedQuestions(int skippedQuestions) {
        this.skippedQuestions = skippedQuestions;
    }
}

