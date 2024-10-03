package com.robodynamics.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "rd_quiz_question_map")
public class RDQuizQuestionMap implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;  // Primary key for the map table

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private RDQuiz quiz;  // Many-to-one relationship with Quiz

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private RDQuizQuestion question;  // Many-to-one relationship with QuizQuestion

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RDQuiz getQuiz() {
        return quiz;
    }

    public void setQuiz(RDQuiz quiz) {
        this.quiz = quiz;
    }

    public RDQuizQuestion getQuestion() {
        return question;
    }

    public void setQuestion(RDQuizQuestion question) {
        this.question = question;
    }

	
}