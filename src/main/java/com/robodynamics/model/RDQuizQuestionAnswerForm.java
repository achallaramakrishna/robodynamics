package com.robodynamics.model;

public class RDQuizQuestionAnswerForm {
	
	
    private String userAnswer;

    // getters and setters
    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

	@Override
	public String toString() {
		return "RDQuizQuestionAnswerForm [userAnswer=" + userAnswer + "]";
	}
    
    
}
