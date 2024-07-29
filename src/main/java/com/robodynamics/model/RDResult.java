package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_quiz_results")
public class RDResult {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "quiz_result_id")
	private int id;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private RDUser user;

	@ManyToOne
	@JoinColumn(name = "quiz_id")
	private RDQuiz quiz;

	@Column(name = "user_answer")
	private String userAnswer;
	 
	@Column(name = "is_correct") 
	private boolean isCorrect;

	public RDResult() {

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

	public RDQuiz getQuiz() {
		return quiz;
	}

	public void setQuiz(RDQuiz quiz) {
		this.quiz = quiz;
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
		return "RDResult [id=" + id + ", user=" + user + ", quiz=" + quiz + ", userAnswer=" + userAnswer
				+ ", isCorrect=" + isCorrect + "]";
	}
	
	

}
