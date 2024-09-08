package com.robodynamics.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "rd_quizzes")
public class RDQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private int quizId;

    @Column(name = "quiz_name", nullable = false)
    private String quizName;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "quiz_type", nullable = false)
    private String quizType;  // This could be something like "multiple_choice" or "fill_in_the_blank"

    @Column(name = "time_limit_seconds")
    private int timeLimitSeconds;

    // One-to-Many relationship with RDQuizQuestion
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<RDQuizQuestion> quizQuestions;

    // Constructors
    public RDQuiz() {}

    public RDQuiz(String quizName, String difficultyLevel, String quizType, int timeLimitSeconds) {
        this.quizName = quizName;
        this.difficultyLevel = difficultyLevel;
        this.quizType = quizType;
        this.timeLimitSeconds = timeLimitSeconds;
    }

    // Getters and Setters
    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
    }

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getQuizType() {
        return quizType;
    }

    public void setQuizType(String quizType) {
        this.quizType = quizType;
    }

    public int getTimeLimitSeconds() {
        return timeLimitSeconds;
    }

    public void setTimeLimitSeconds(int timeLimitSeconds) {
        this.timeLimitSeconds = timeLimitSeconds;
    }

    public List<RDQuizQuestion> getQuizQuestions() {
        return quizQuestions;
    }

    public void setQuizQuestions(List<RDQuizQuestion> quizQuestions) {
        this.quizQuestions = quizQuestions;
    }

    // Optional toString() for debugging purposes
    @Override
    public String toString() {
        return "RDQuiz{" +
                "quizId=" + quizId +
                ", quizName='" + quizName + '\'' +
                ", difficultyLevel='" + difficultyLevel + '\'' +
                ", quizType='" + quizType + '\'' +
                ", timeLimitSeconds=" + timeLimitSeconds +
                '}';
    }
}
