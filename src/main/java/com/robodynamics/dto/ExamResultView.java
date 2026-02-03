package com.robodynamics.dto;

import java.util.List;

public class ExamResultView {

    private Integer submissionId;
    private Double totalMarksAwarded;
    private Integer totalMarks;
    private String overallFeedback;

    private boolean needsTeacherReview;

    private List<ExamResultQuestionView> questions;

	public Integer getSubmissionId() {
		return submissionId;
	}

	public void setSubmissionId(Integer submissionId) {
		this.submissionId = submissionId;
	}

	public Double getTotalMarksAwarded() {
		return totalMarksAwarded;
	}

	public void setTotalMarksAwarded(Double totalMarksAwarded) {
		this.totalMarksAwarded = totalMarksAwarded;
	}

	public Integer getTotalMarks() {
		return totalMarks;
	}

	public void setTotalMarks(Integer totalMarks) {
		this.totalMarks = totalMarks;
	}

	public String getOverallFeedback() {
		return overallFeedback;
	}

	public void setOverallFeedback(String overallFeedback) {
		this.overallFeedback = overallFeedback;
	}

	public boolean isNeedsTeacherReview() {
		return needsTeacherReview;
	}

	public void setNeedsTeacherReview(boolean needsTeacherReview) {
		this.needsTeacherReview = needsTeacherReview;
	}

	public List<ExamResultQuestionView> getQuestions() {
		return questions;
	}

	public void setQuestions(List<ExamResultQuestionView> questions) {
		this.questions = questions;
	}

    
}
