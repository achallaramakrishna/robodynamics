package com.robodynamics.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "rd_goal_templates")
public class RDGoalTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "exam_type", nullable = false)
    private String examType;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "target_duration_days", nullable = false)
    private int targetDurationDays; // Days required to achieve this goal

    @Column(name = "difficulty_level", nullable = false)
    private String difficultyLevel; // e.g., beginner, intermediate, advanced

    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getTargetDurationDays() {
        return targetDurationDays;
    }

    public void setTargetDurationDays(int targetDurationDays) {
        this.targetDurationDays = targetDurationDays;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }
}
