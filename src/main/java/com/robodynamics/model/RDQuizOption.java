package com.robodynamics.model;

import javax.persistence.*;

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

    // Many-to-One relationship with RDQuizQuestion
    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private RDQuizQuestion quizQuestion;

    // Constructors
    public RDQuizOption() {}

    public RDQuizOption(String optionText, boolean isCorrect, RDQuizQuestion quizQuestion) {
        this.optionText = optionText;
        this.isCorrect = isCorrect;
        this.quizQuestion = quizQuestion;
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

    public RDQuizQuestion getQuizQuestion() {
        return quizQuestion;
    }

    public void setQuizQuestion(RDQuizQuestion quizQuestion) {
        this.quizQuestion = quizQuestion;
    }

    // Optional toString() method for debugging
    @Override
    public String toString() {
        return "RDQuizOption{" +
                "optionId=" + optionId +
                ", optionText='" + optionText + '\'' +
                ", isCorrect=" + isCorrect +
                ", quizQuestion=" + quizQuestion +
                '}';
    }
}
