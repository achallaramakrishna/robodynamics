package com.robodynamics.dto;

import java.time.LocalDateTime;

public class RDStudentQuizSummary {

    private int quizId;
    private String quizTitle;
    private int score;
    private boolean passed;
    private int completionTime;
    private LocalDateTime completedAt;

    public RDStudentQuizSummary(
            int quizId,
            String quizTitle,
            int score,
            boolean passed,
            int completionTime,
            LocalDateTime completedAt) {
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.score = score;
        this.passed = passed;
        this.completionTime = completionTime;
        this.completedAt = completedAt;
    }

	public int getQuizId() {
		return quizId;
	}

	public void setQuizId(int quizId) {
		this.quizId = quizId;
	}

	public String getQuizTitle() {
		return quizTitle;
	}

	public void setQuizTitle(String quizTitle) {
		this.quizTitle = quizTitle;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public boolean isPassed() {
		return passed;
	}

	public void setPassed(boolean passed) {
		this.passed = passed;
	}

	public int getCompletionTime() {
		return completionTime;
	}

	public void setCompletionTime(int completionTime) {
		this.completionTime = completionTime;
	}

	public LocalDateTime getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(LocalDateTime completedAt) {
		this.completedAt = completedAt;
	}

    
}
