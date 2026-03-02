package com.robodynamics.dto;

import java.util.ArrayList;
import java.util.List;

public class RDCreateExamPaperRequest {

    private Integer courseId;
    private List<Integer> sessionIds = new ArrayList<>();
    private List<String> questionTypes = new ArrayList<>();
    private List<String> difficultyLevels = new ArrayList<>();
    private String examType;
    private Integer totalMarks;
    private Integer durationMinutes;
    private Integer numberOfPapers;
    private Integer aiTargetMarks;
    private Boolean allowAiAugmentation;
    private String titlePrefix;
    private String subject;
    private String board;
    private Integer examYear;

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

    public List<String> getQuestionTypes() {
        return questionTypes;
    }

    public void setQuestionTypes(List<String> questionTypes) {
        this.questionTypes = questionTypes;
    }

    public List<String> getDifficultyLevels() {
        return difficultyLevels;
    }

    public void setDifficultyLevels(List<String> difficultyLevels) {
        this.difficultyLevels = difficultyLevels;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getNumberOfPapers() {
        return numberOfPapers;
    }

    public void setNumberOfPapers(Integer numberOfPapers) {
        this.numberOfPapers = numberOfPapers;
    }

    public Integer getAiTargetMarks() {
        return aiTargetMarks;
    }

    public void setAiTargetMarks(Integer aiTargetMarks) {
        this.aiTargetMarks = aiTargetMarks;
    }

    public Boolean getAllowAiAugmentation() {
        return allowAiAugmentation;
    }

    public void setAllowAiAugmentation(Boolean allowAiAugmentation) {
        this.allowAiAugmentation = allowAiAugmentation;
    }

    public String getTitlePrefix() {
        return titlePrefix;
    }

    public void setTitlePrefix(String titlePrefix) {
        this.titlePrefix = titlePrefix;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBoard() {
        return board;
    }

    public void setBoard(String board) {
        this.board = board;
    }

    public Integer getExamYear() {
        return examYear;
    }

    public void setExamYear(Integer examYear) {
        this.examYear = examYear;
    }
}
