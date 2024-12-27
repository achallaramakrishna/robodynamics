package com.robodynamics.wrapper;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CourseSessionDetailJson {

    private int sessionId;

    private int sessionDetailId;

    private String topic;
    private int version;
    private String type;
    private String file;

 // New fields for tier level and tier order
    private String tierLevel; // Use String for easier JSON serialization and conversion
    private int tierOrder;
    
    // Getters and Setters

    public CourseSessionDetailJson() {
		
	}
    public CourseSessionDetailJson(int courseSessionDetailId, String topic2) {
		this.sessionDetailId = courseSessionDetailId;
		this.topic = topic2;
	}

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

	public String getTierLevel() {
		return tierLevel;
	}

	public void setTierLevel(String tierLevel) {
		this.tierLevel = tierLevel;
	}

	public int getTierOrder() {
		return tierOrder;
	}

	public void setTierOrder(int tierOrder) {
		this.tierOrder = tierOrder;
	}

   
}
