package com.robodynamics.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Table(name = "rd_flashcards")
public class RDFlashCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flashcard_id")
    private int flashcardId;

    @Column(name = "question", nullable = false)
    private String question;

    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "hint")
    private String hint;

    @Column(name = "question_image_url")
    private String questionImageUrl;
    
    @Column(name = "answer_image_url")
    private String answerImageUrl;
    
    @Column(name = "example")
    private String example; // New field for storing an example

    @Column(name = "insight")
    private String insight; // New field for storing insights, e.g., NEET, JEE, etc.

    @Column(name = "insight_type")
    @Enumerated(EnumType.STRING)
    private InsightType insightType; // New enum field for insight type (e.g., 'neet', 'jee', 'interview')
    
    // Enum for Insight Type
    public enum InsightType {
        NEET, JEE, INTERVIEW
    }

    @ManyToOne
    @JoinColumn(name = "flashcard_set_id", nullable = false)
    @JsonBackReference  // This prevents infinite recursion during JSON serialization
    private RDFlashCardSet flashcardSet;

    @OneToMany(mappedBy = "flashCard", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<RDFlashCardAttempt> attempts;

    // Getters and Setters

    public int getFlashcardId() {
        return flashcardId;
    }

    public void setFlashcardId(int flashcardId) {
        this.flashcardId = flashcardId;
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

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

   

    public String getQuestionImageUrl() {
		return questionImageUrl;
	}

	public void setQuestionImageUrl(String questionImageUrl) {
		this.questionImageUrl = questionImageUrl;
	}

	public String getAnswerImageUrl() {
		return answerImageUrl;
	}

	public void setAnswerImageUrl(String answerImageUrl) {
		this.answerImageUrl = answerImageUrl;
	}

	public RDFlashCardSet getFlashcardSet() {
        return flashcardSet;
    }

    public void setFlashcardSet(RDFlashCardSet flashcardSet) {
        this.flashcardSet = flashcardSet;
    }

    public List<RDFlashCardAttempt> getAttempts() {
        return attempts;
    }

    public void setAttempts(List<RDFlashCardAttempt> attempts) {
        this.attempts = attempts;
    }

	public String getExample() {
		return example;
	}

	public void setExample(String example) {
		this.example = example;
	}

	public String getInsight() {
		return insight;
	}

	public void setInsight(String insight) {
		this.insight = insight;
	}

	public InsightType getInsightType() {
		return insightType;
	}

	public void setInsightType(InsightType insightType) {
		this.insightType = insightType;
	}
    
}
