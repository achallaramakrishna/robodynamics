package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_user_quiz_answers")
public class RDQuizAnswer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "answer_id")
	private int id;

	@ManyToOne
	@JoinColumn(name = "result_id", nullable = false)
	private RDQuizResult quizResult; // Link to RDQuizResult

	@ManyToOne
	@JoinColumn(name = "question_id", nullable = false)
	private RDQuizQuestion question; // Link to RDQuizQuestion

	@Column(name = "selected_option_id")
	private Integer selectedOptionId; // For multiple-choice questions

	@Column(name = "fill_in_answer")
	private String fillInAnswer; // For fill-in-the-blank questions

	// Getters and Setters
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public RDQuizResult getQuizResult() {
		return quizResult;
	}

	public void setQuizResult(RDQuizResult quizResult) {
		this.quizResult = quizResult;
	}

	public RDQuizQuestion getQuestion() {
		return question;
	}

	public void setQuestion(RDQuizQuestion question) {
		this.question = question;
	}

	public Integer getSelectedOptionId() {
		return selectedOptionId;
	}

	public void setSelectedOptionId(Integer selectedOptionId) {
		this.selectedOptionId = selectedOptionId;
	}

	public String getFillInAnswer() {
		return fillInAnswer;
	}

	public void setFillInAnswer(String fillInAnswer) {
		this.fillInAnswer = fillInAnswer;
	}
}
