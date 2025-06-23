package com.robodynamics.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "rd_quiz_options")
public class RDQuizOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private int optionId;

    @Column(name = "option_text", nullable = false)
    private String optionText;
    
    @Column(name = "option_image")
    private String optionImage;  // Store the image URL

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @Column(name = "selected", nullable = false)
    private boolean selected;  // Add this property
    
    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)  // Mapping back to parent
    @JsonBackReference  // This prevents infinite recursion during JSON serialization
    private RDQuizQuestion question;

    
    public RDQuizQuestion getQuestion() {
		return question;
	}

	public void setQuestion(RDQuizQuestion question) {
		this.question = question;
	}

	// Constructors
    public RDQuizOption() {}

    public RDQuizOption(String optionText, boolean isCorrect) {
        this.optionText = optionText;
        this.isCorrect = isCorrect;
       
    }
    
    

    public String getOptionImage() {
		return optionImage;
	}

	public void setOptionImage(String optionImage) {
		this.optionImage = optionImage;
	}

	// Getters and Setters
    public int getOptionId() {
        return optionId;
    }

    public void setOptionId(int optionId) {
        this.optionId = optionId;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }



	

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

	@Override
	public String toString() {
		return "RDQuizOption [optionId=" + optionId + ", optionText=" + optionText + ", isCorrect=" + isCorrect
				+ ", selected=" + selected + "]";
	}

	

	
    
}
