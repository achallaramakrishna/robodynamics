package com.robodynamics.wrapper;

public class CourseSessionJson {
    private int sessionId;
    private String sessionTitle;
    private int version;
    private String grade;
    private String sessionType;
    private Integer parentSessionId;
    private String sessionDescription;
    
    

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
    
    
}
