package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_quiz_question_results")
public class RDQuizResult {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "quiz_question_result_id")
	private int id;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private RDUser user;

	@ManyToOne
	@JoinColumn(name = "quiz_question_id")
	private RDQuizQuestion quizQuestion;

	@Column(name = "user_answer")
	private String userAnswer;
	 
	@Column(name = "is_correct") 
	private boolean isCorrect;

	public RDQuizResult() {

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public RDUser getUser() {
		return user;
	}

	public void setUser(RDUser user) {
		this.user = user;
	}

	
	public RDQuizQuestion getQuizQuestion() {
		return quizQuestion;
	}

	public void setQuizQuestion(RDQuizQuestion quizQuestion) {
		this.quizQuestion = quizQuestion;
	}

	public String getUserAnswer() {
		return userAnswer;
	}

	public void setUserAnswer(String userAnswer) {
		this.userAnswer = userAnswer;
	}



	public boolean isCorrect() {
		return isCorrect;
	}

	public void setCorrect(boolean isCorrect) {
		this.isCorrect = isCorrect;
	}

	@Override
	public String toString() {
		return "RDResult [id=" + id + ", user=" + user + ", quizQuestion=" + quizQuestion + ", userAnswer=" + userAnswer
				+ ", isCorrect=" + isCorrect + "]";
	}
	
	

}
