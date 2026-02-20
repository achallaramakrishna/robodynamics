package com.robodynamics.dto;

import java.util.List;

public class ExamResultView {

	private Integer examPaperId;
	private boolean studentAnswerAvailable;

    private Integer submissionId;
    private Double totalMarksAwarded;
    private Integer totalMarks;
    private String overallFeedback;

    private boolean needsTeacherReview;
    
    private String studentName;
    private String examTitle;
    private String subject;
    private String board;
    private Integer examYear;
    private String examType;
    private Integer durationMinutes;
    private String examDate; // formatted string for UI + PDF


    private List<ExamResultQuestionView> questions;

    
    
	public boolean isStudentAnswerAvailable() {
		return studentAnswerAvailable;
	}

	public void setStudentAnswerAvailable(boolean studentAnswerAvailable) {
		this.studentAnswerAvailable = studentAnswerAvailable;
	}

	public Integer getExamPaperId() {
		return examPaperId;
	}

	public void setExamPaperId(Integer examPaperId) {
		this.examPaperId = examPaperId;
	}

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

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getExamTitle() {
		return examTitle;
	}

	public void setExamTitle(String examTitle) {
		this.examTitle = examTitle;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getBoard() {
		return board;
	}

	public void setBoard(String board) {
		this.board = board;
	}

	public Integer getExamYear() {
		return examYear;
	}

	public void setExamYear(Integer examYear) {
		this.examYear = examYear;
	}

	public String getExamType() {
		return examType;
	}

	public void setExamType(String examType) {
		this.examType = examType;
	}

	public Integer getDurationMinutes() {
		return durationMinutes;
	}

	public void setDurationMinutes(Integer durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

	public String getExamDate() {
		return examDate;
	}

	public void setExamDate(String examDate) {
		this.examDate = examDate;
	}

    
}
