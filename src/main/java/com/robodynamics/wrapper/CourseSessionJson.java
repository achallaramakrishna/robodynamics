package com.robodynamics.wrapper;

public class CourseSessionJson {
    private int sessionId;
    private String sessionTitle;
    private int version;
    private String grade;
    private String sessionType;
    private Integer parentSessionId;
    private String sessionDescription;
    private String tierLevel; // New field for tier level
    private int tierOrder;    // New field for tier order
    
    
    

    // Getters and setters
    public int getSessionId() {
        return sessionId;
    }

    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }

    
    
    public String getSessionDescription() {
		return sessionDescription;
	}

	public void setSessionDescription(String sessionDescription) {
		this.sessionDescription = sessionDescription;
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
