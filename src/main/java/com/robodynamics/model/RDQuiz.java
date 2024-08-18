package com.robodynamics.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "rd_quiz")
public class RDQuiz {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "quiz_id")
	private int quiz_id;

	@Column(name = "quiz_title")
	private String quizTitle;
	
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinColumn(name="quiz_id", nullable = true)
	private List<RDQuizQuestion> quizQuestions = new ArrayList<RDQuizQuestion>();


	public RDQuiz() {
		
	}

	public int getQuiz_id() {
		return quiz_id;
	}

	public void setQuiz_id(int quiz_id) {
		this.quiz_id = quiz_id;
	}

	public String getQuizTitle() {
		return quizTitle;
	}

	public void setQuizTitle(String quizTitle) {
		this.quizTitle = quizTitle;
	}
	
	

	public List<RDQuizQuestion> getQuizQuestions() {
		return quizQuestions;
	}

	public void setQuizQuestions(List<RDQuizQuestion> quizQuestions) {
		this.quizQuestions = quizQuestions;
	}

	@Override
	public String toString() {
		return "RDQuiz [quiz_id=" + quiz_id + ", quizTitle=" + quizTitle + "]";
	}
	
}
