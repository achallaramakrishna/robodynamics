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
import javax.persistence.Table;

@Entity
@Table(name = "rd_fill_in_blank_questions")
public class RDFillInBlankQuestion {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_id")
    private int questionId;
    
	@ManyToOne
    @JoinColumn(name = "slide_id")
    private RDSlide slide;
    
	@Column(name = "question")
    private String question;
    
	@Column(name = "answer")
    private String answer;
	
	@Column(name = "points")
    private int points; // Add points for each question
	 

    // Getters and Setters
    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

   

    public RDSlide getSlide() {
		return slide;
	}

	public void setSlide(RDSlide slide) {
		this.slide = slide;
	}

	
    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}
    
}

