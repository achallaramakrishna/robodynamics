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

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @Column(name = "selected", nullable = false)
    private boolean selected;  // Add this property
    
    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private RDQuestion question;

    // Constructors
    public RDQuizOption() {}

    public RDQuizOption(String optionText, boolean isCorrect, RDQuestion question) {
        this.optionText = optionText;
        this.isCorrect = isCorrect;
        this.question = question;
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



	public RDQuestion getQuestion() {
		return question;
	}

	public void setQuestion(RDQuestion question) {
		this.question = question;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}


	
    
}
