package com.robodynamics.model;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.persistence.CascadeType;
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
@Table(name = "rd_quiz_questions")
public class RDQuizQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int quiz_question_id;
    
    @Column(name = "question")
    private String question;
    
    @Column(name = "option1")
    private String option1;
    
    @Column(name = "option2")
    private String option2;
    
    @Column(name = "option3")
    private String option3;
    
    @Column(name = "option4")
    private String option4;
    
    @Column(name = "correct_answer")
    private String correctAnswer;
    
    
    public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public String getOption1() {
		return option1;
	}
	public void setOption1(String option1) {
		this.option1 = option1;
	}
	public String getOption2() {
		return option2;
	}
	public void setOption2(String option2) {
		this.option2 = option2;
	}
	public String getOption3() {
		return option3;
	}
	public void setOption3(String option3) {
		this.option3 = option3;
	}
	public String getOption4() {
		return option4;
	}
	public void setOption4(String option4) {
		this.option4 = option4;
	}
	public String getCorrectAnswer() {
		return correctAnswer;
	}
	public void setCorrectAnswer(String correctAnswer) {
		this.correctAnswer = correctAnswer;
	}
	public int getQuiz_question_id() {
		return quiz_question_id;
	}
	public void setQuiz_question_id(int quiz_question_id) {
		this.quiz_question_id = quiz_question_id;
	}


    
}