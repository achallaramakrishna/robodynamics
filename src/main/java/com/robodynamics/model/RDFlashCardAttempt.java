package com.robodynamics.model;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "rd_flashcard_attempts")
public class RDFlashCardAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_id")
    private int attemptId;

    @ManyToOne
    @JoinColumn(name = "flashcard_id", nullable = false)
    private RDFlashCard flashCard;

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "attempt_date", nullable = false)
    private Timestamp attemptDate;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    // Getters and Setters

    public int getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(int attemptId) {
        this.attemptId = attemptId;
    }

    public RDFlashCard getFlashCard() {
        return flashCard;
    }

    public void setFlashCard(RDFlashCard flashCard) {
        this.flashCard = flashCard;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Timestamp getAttemptDate() {
        return attemptDate;
    }

    public void setAttemptDate(Timestamp attemptDate) {
        this.attemptDate = attemptDate;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}
