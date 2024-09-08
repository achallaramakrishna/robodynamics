package com.robodynamics.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "rd_quiz_questions")
public class RDQuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private int questionId;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "question_type", nullable = false)
    private String questionType;  // E.g., "multiple_choice" or "fill_in_the_blank"

    // Many-to-One relationship with RDQuiz
    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private RDQuiz quiz;

    // One-to-Many relationship with RDQuizOption (each question can have multiple options)
    @OneToMany(mappedBy = "quizQuestion", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<RDQuizOption> options;

    // Constructors
    public RDQuizQuestion() {}

    public RDQuizQuestion(String questionText, String questionType, RDQuiz quiz) {
        this.questionText = questionText;
        this.questionType = questionType;
        this.quiz = quiz;
    }

    // Getters and Setters
    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public RDQuiz getQuiz() {
        return quiz;
    }

    public void setQuiz(RDQuiz quiz) {
        this.quiz = quiz;
    }

    public List<RDQuizOption> getOptions() {
        return options;
    }

    public void setOptions(List<RDQuizOption> options) {
        this.options = options;
    }
    
    // Method to find the correct option for the question
    public RDQuizOption getCorrectOption() {
        for (RDQuizOption option : options) {
            if (option.isCorrect()) {
                return option;  // Return the option where isCorrect is true
            }
        }
        return null; // No correct option found (this shouldn't happen if data is correct)
    }

    // Optional toString() for debugging
    @Override
    public String toString() {
        return "RDQuizQuestion{" +
                "questionId=" + questionId +
                ", questionText='" + questionText + '\'' +
                ", questionType='" + questionType + '\'' +
                ", quiz=" + quiz +
                '}';
    }
}
