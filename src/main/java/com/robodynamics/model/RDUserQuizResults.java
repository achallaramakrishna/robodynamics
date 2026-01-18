package com.robodynamics.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "rd_user_quiz_results")
public class RDUserQuizResults {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private int id;  // Primary key for each result entry

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private RDUser user;  // Foreign key to RDUser

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private RDQuiz quiz;  // Foreign key to RDQuiz

    @Column(name = "score")
    private int score;  // Number of correct answers

    @Column(name = "completion_time")
    private int completionTime;  // Time taken in seconds to complete the quiz

    @Column(name = "start_time", nullable = false)
    private LocalDateTime  startTime;  // When the quiz was started

    @Column(name = "end_time")
    private LocalDateTime  endTime;  // When the quiz was completed

    @Column(name = "passed", nullable = false)
    private boolean passed;  // Whether the user passed the quiz

    @Column(name = "points_earned", nullable = false)
    private int pointsEarned;  // Points earned from completing the quiz

    @Column(name = "completed_at")
    private LocalDateTime  completedAt;  // When the quiz was completed

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RDUser getUser() {
        return user;
    }

    public void setUser(RDUser user) {
        this.user = user;
    }

    public RDQuiz getQuiz() {
        return quiz;
    }

    public void setQuiz(RDQuiz quiz) {
        this.quiz = quiz;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(int completionTime) {
        this.completionTime = completionTime;
    }

    public LocalDateTime  getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime  startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime  getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime  endTime) {
        this.endTime = endTime;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public int getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(int pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public LocalDateTime  getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime  completedAt) {
        this.completedAt = completedAt;
    }
}
