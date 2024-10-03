package com.robodynamics.form;

import java.util.List;

import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;

public class RDQuizForm {

    private Integer courseId;  // Single course selection (course ID)

    private List<Integer> sessionIds;  // Multiple session selections (session IDs)

    private List<Integer> sessionDetailIds;  // Multiple session detail selections (session detail IDs)

    private String quizName;  // Quiz name

    private int questionLimit;  // Number of questions to include

    private List<DifficultyLevel> difficultyLevels;  // Multiple difficulty levels

    // Getters and Setters

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public List<Integer> getSessionIds() {
        return sessionIds;
    }

    public void setSessionIds(List<Integer> sessionIds) {
        this.sessionIds = sessionIds;
    }

    public List<Integer> getSessionDetailIds() {
        return sessionDetailIds;
    }

    public void setSessionDetailIds(List<Integer> sessionDetailIds) {
        this.sessionDetailIds = sessionDetailIds;
    }

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    public int getQuestionLimit() {
        return questionLimit;
    }

    public void setQuestionLimit(int questionLimit) {
        this.questionLimit = questionLimit;
    }

    public List<DifficultyLevel> getDifficultyLevels() {
        return difficultyLevels;
    }

    public void setDifficultyLevels(List<DifficultyLevel> difficultyLevels) {
        this.difficultyLevels = difficultyLevels;
    }
}
