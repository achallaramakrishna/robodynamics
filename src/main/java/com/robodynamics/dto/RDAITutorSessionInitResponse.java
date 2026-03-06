package com.robodynamics.dto;

public class RDAITutorSessionInitResponse {

    private String launchUrl;
    private long expiresInSec;
    private String module;
    private String grade;
    private Integer childId;

    public String getLaunchUrl() {
        return launchUrl;
    }

    public void setLaunchUrl(String launchUrl) {
        this.launchUrl = launchUrl;
    }

    public long getExpiresInSec() {
        return expiresInSec;
    }

    public void setExpiresInSec(long expiresInSec) {
        this.expiresInSec = expiresInSec;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Integer getChildId() {
        return childId;
    }

    public void setChildId(Integer childId) {
        this.childId = childId;
    }
}

