package com.robodynamics.wrapper;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CourseSessionDetailJson {

    @JsonProperty("session_id")
    private int sessionId;

    @JsonProperty("session_detail_id")
    private int sessionDetailId;

    private String topic;
    private int version;
    private String type;
    private String file;

    // Getters and Setters

    public int getSessionId() {
        return sessionId;
    }

    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }

    public int getSessionDetailId() {
        return sessionDetailId;
    }

    public void setSessionDetailId(int sessionDetailId) {
        this.sessionDetailId = sessionDetailId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    // toString() method for debugging or logging

    @Override
    public String toString() {
        return "CourseSessionDetailJson{" +
                "sessionId=" + sessionId +
                ", sessionDetailId=" + sessionDetailId +
                ", topic='" + topic + '\'' +
                ", version=" + version +
                ", type='" + type + '\'' +
                ", file='" + file + '\'' +
                '}';
    }
}
