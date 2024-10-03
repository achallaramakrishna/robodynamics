package com.robodynamics.form;

public class RDQuizDashboardForm {

    // Field to store the selected course ID for filtering
    private Integer courseId;

    // Field to store the selected status for filtering (e.g., "published", "archived")
    private String status;

    // Field to store the selected difficulty level for filtering (e.g., "Easy", "Medium", "Hard")
    private String difficultyLevel;

    // Getters and Setters
    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }
}

