package com.robodynamics.wrapper;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true) // ignore extras safely
public class CourseSessionDetailJson {

    // Primary JSON key we emit is "courseSessionId", but accept "sessionId" too
    @JsonProperty("courseSessionId")
    @JsonAlias({"sessionId"})
    private int sessionId;

    // Primary JSON key we emit is "courseSessionDetailId", but accept "sessionDetailId" too
    @JsonProperty("courseSessionDetailId")
    @JsonAlias({"sessionDetailId"})
    private int sessionDetailId;

    private String topic;
    private int version = 1; // sensible default
    private String type;
    private String file;

    private String tierLevel; // optional
    private int tierOrder;    // optional

    public CourseSessionDetailJson() {}
    public CourseSessionDetailJson(int courseSessionDetailId, String topic) {
        this.sessionDetailId = courseSessionDetailId;
        this.topic = topic;
    }

    public int getSessionId() { return sessionId; }
    public void setSessionId(int sessionId) { this.sessionId = sessionId; }

    public int getSessionDetailId() { return sessionDetailId; }
    public void setSessionDetailId(int sessionDetailId) { this.sessionDetailId = sessionDetailId; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getFile() { return file; }
    public void setFile(String file) { this.file = file; }

    public String getTierLevel() { return tierLevel; }
    public void setTierLevel(String tierLevel) { this.tierLevel = tierLevel; }

    public int getTierOrder() { return tierOrder; }
    public void setTierOrder(int tierOrder) { this.tierOrder = tierOrder; }
}
