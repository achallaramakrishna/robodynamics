package com.robodynamics.dto;

import java.util.ArrayList;
import java.util.List;

public class RDExerciseExtractionRequest {

    private Integer courseId;
    private List<Integer> sessionIds = new ArrayList<>();
    private Integer maxPdfs;
    private Boolean includeNonExercise;
    private Boolean dryRun;

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

    public Integer getMaxPdfs() {
        return maxPdfs;
    }

    public void setMaxPdfs(Integer maxPdfs) {
        this.maxPdfs = maxPdfs;
    }

    public Boolean getIncludeNonExercise() {
        return includeNonExercise;
    }

    public void setIncludeNonExercise(Boolean includeNonExercise) {
        this.includeNonExercise = includeNonExercise;
    }

    public Boolean getDryRun() {
        return dryRun;
    }

    public void setDryRun(Boolean dryRun) {
        this.dryRun = dryRun;
    }
}

