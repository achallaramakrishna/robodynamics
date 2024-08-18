package com.robodynamics.model;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_quiz_test")
public class RDQuizTest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "quiz_test_id")
	private int quizTestId;
	
	@OneToOne
    @JoinColumn(name = "quiz_id")
	private RDQuiz quiz;
	
	@Column(name = "creation_date")
	private Date creationDate;
	
	@Column(name = "active")
	private int active;

	public int getQuizTestId() {
		return quizTestId;
	}

	public void setQuizTestId(int quizTestId) {
		this.quizTestId = quizTestId;
	}

	public RDQuiz getQuiz() {
		return quiz;
	}

	public void setQuiz(RDQuiz quiz) {
		this.quiz = quiz;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public int getActive() {
		return active;
	}

	public void setActive(int active) {
		this.active = active;
	}
	
	
	
}
