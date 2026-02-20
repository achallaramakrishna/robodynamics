package com.robodynamics.dto;

import java.util.List;

public class ExamResultQuestionView {
	
    private Integer questionId;


    public Integer getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}

	/* ================= SECTION ================= */
    private String sectionTitle;

    /* ================= QUESTION ================= */
    private String questionText;
    private int maxMarks;

    /* ================= ANSWERS ================= */
    private String correctAnswer;     // from rd_exam_answer_keys
    private String studentAnswer;     // from submission answers

    /* ================= EVALUATION ================= */
    private double marksAwarded;
    private String feedback;
    
    private String questionType;          // NEW
    private List<McqOptionView> options;       // NEW

    /* ================= GETTERS / SETTERS ================= */

    public String getSectionTitle() {
        return sectionTitle;
    }

    public void setSectionTitle(String sectionTitle) {
        this.sectionTitle = sectionTitle;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getQuestionType() {
		return questionType;
	}

	public void setQuestionType(String questionType) {
		this.questionType = questionType;
	}

	public List<McqOptionView> getOptions() {
		return options;
	}

	public void setOptions(List<McqOptionView> options) {
		this.options = options;
	}

	public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public int getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(int maxMarks) {
        this.maxMarks = maxMarks;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getStudentAnswer() {
        return studentAnswer;
    }

    public void setStudentAnswer(String studentAnswer) {
        this.studentAnswer = studentAnswer;
    }

    public double getMarksAwarded() {
        return marksAwarded;
    }

    public void setMarksAwarded(double marksAwarded) {
        this.marksAwarded = marksAwarded;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
