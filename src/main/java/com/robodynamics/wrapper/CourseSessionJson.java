// CourseSessionJson.java
package com.robodynamics.wrapper;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CourseSessionJson {
    @JsonProperty("courseSessionId")  // <-- keeps your JS happy
    private int sessionId;

    private String sessionTitle;
    private int version;
    private String grade;
    private String sessionType;
    private Integer parentSessionId;
    private String sessionDescription;
    private String tierLevel;
    private int tierOrder;
	public int getSessionId() {
		return sessionId;
	}
	public void setSessionId(int sessionId) {
		this.sessionId = sessionId;
	}
	public String getSessionTitle() {
		return sessionTitle;
	}
	public void setSessionTitle(String sessionTitle) {
		this.sessionTitle = sessionTitle;
	}
	public int getVersion() {
		return version;
	}
	public void setVersion(int version) {
		this.version = version;
	}
	public String getGrade() {
		return grade;
	}
	public void setGrade(String grade) {
		this.grade = grade;
	}
	public String getSessionType() {
		return sessionType;
	}
	public void setSessionType(String sessionType) {
		this.sessionType = sessionType;
	}
	public Integer getParentSessionId() {
		return parentSessionId;
	}
	public void setParentSessionId(Integer parentSessionId) {
		this.parentSessionId = parentSessionId;
	}
	public String getSessionDescription() {
		return sessionDescription;
	}
	public void setSessionDescription(String sessionDescription) {
		this.sessionDescription = sessionDescription;
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
