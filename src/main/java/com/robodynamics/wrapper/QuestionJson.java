package com.robodynamics.wrapper;

import java.util.List;

public class QuestionJson {
    private String questionText;
    private String questionType;
    private String difficultyLevel;
    private int maxMarks;
    private int points;
    private String tierLevel;
    private int tierOrder;
    private String correctAnswer;
    private String explanation;
    private int sessionId;
    
    private List<OptionJson> options;
    
    
    
	public int getSessionId() {
		return sessionId;
	}
	public void setSessionId(int sessionId) {
		this.sessionId = sessionId;
	}
	public String getQuestionText() {
		return questionText;
	}
	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}
	public String getQuestionType() {
		return questionType;
	}
	public void setQuestionType(String questionType) {
		this.questionType = questionType;
	}
	public String getDifficultyLevel() {
		return difficultyLevel;
	}
	public void setDifficultyLevel(String difficultyLevel) {
		this.difficultyLevel = difficultyLevel;
	}
	public int getMaxMarks() {
		return maxMarks;
	}
	public void setMaxMarks(int maxMarks) {
		this.maxMarks = maxMarks;
	}
	public int getPoints() {
		return points;
	}
	public void setPoints(int points) {
		this.points = points;
	}
	public String getTierLevel() {
		return tierLevel;
	}
	public void setTierLevel(String tierLevel) {
		this.tierLevel = tierLevel;
	}
	public int getTierOrder() {
		return tierOrder;
	}
	public void setTierOrder(int tierOrder) {
		this.tierOrder = tierOrder;
	}
	public String getCorrectAnswer() {
		return correctAnswer;
	}
	public void setCorrectAnswer(String correctAnswer) {
		this.correctAnswer = correctAnswer;
	}
	public List<OptionJson> getOptions() {
		return options;
	}
	public void setOptions(List<OptionJson> options) {
		this.options = options;
	}
	public String getExplanation() {
		return explanation;
	}
	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}
	
	

    
}
