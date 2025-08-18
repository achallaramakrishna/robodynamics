package com.robodynamics.dto;

public class RDSessionDetailStat {
    private Integer sessionId;
    private String  sessionTitle;
    private int     details;

    public RDSessionDetailStat(Integer sessionId, String sessionTitle, int details) {
        this.sessionId = sessionId;
        this.sessionTitle = sessionTitle;
        this.details = details;
    }
    public Integer getSessionId() { return sessionId; }
    public String  getSessionTitle() { return sessionTitle; }
    public int     getDetails() { return details; }
}