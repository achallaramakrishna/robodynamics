package com.robodynamics.form;

public class RDCourseOfferingForm {

	private int courseOfferingId;
	private String courseOfferingName;
	private int courseId;
	private String courseName;
	private int userID;
	private String status;

	private String startDate;
	private String endDate;

	// ✅ New Fields
	private Integer sessionsPerWeek;
	private String daysOfWeek; // stored as comma-separated string
	private String sessionStartTime;  // e.g., "10:00"
	private String sessionEndTime;    // e.g., "11:00"
	
	private Double feeAmount;

	public RDCourseOfferingForm() {
	}

	public int getCourseOfferingId() {
		return courseOfferingId;
	}
	public void setCourseOfferingId(int courseOfferingId) {
		this.courseOfferingId = courseOfferingId;
	}

	public int getCourseId() {
		return courseId;
	}
	public void setCourseId(int courseId) {
		this.courseId = courseId;
	}

	public String getCourseName() {
		return courseName;
	}
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getCourseOfferingName() {
		return courseOfferingName;
	}
	public void setCourseOfferingName(String courseOfferingName) {
		this.courseOfferingName = courseOfferingName;
	}

	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public int getUserID() {
		return userID;
	}
	public void setUserID(int userID) {
		this.userID = userID;
	}

	// ✅ New Getters and Setters
	public Integer getSessionsPerWeek() {
		return sessionsPerWeek;
	}
	public void setSessionsPerWeek(Integer sessionsPerWeek) {
		this.sessionsPerWeek = sessionsPerWeek;
	}

	public String getDaysOfWeek() {
	    return daysOfWeek;
	}

	public void setDaysOfWeek(String daysOfWeek) {
	    this.daysOfWeek = daysOfWeek;
	}

	public String getSessionStartTime() {
		return sessionStartTime;
	}
	public void setSessionStartTime(String sessionStartTime) {
		this.sessionStartTime = sessionStartTime;
	}

	public String getSessionEndTime() {
		return sessionEndTime;
	}
	public void setSessionEndTime(String sessionEndTime) {
		this.sessionEndTime = sessionEndTime;
	}
	
	

	public Double getFeeAmount() {
		return feeAmount;
	}

	public void setFeeAmount(Double feeAmount) {
		this.feeAmount = feeAmount;
	}

	@Override
	public String toString() {
		return "RDCourseOfferingForm [courseOfferingId=" + courseOfferingId +
				", courseOfferingName=" + courseOfferingName +
				", courseId=" + courseId +
				", courseName=" + courseName +
				", userID=" + userID +
				", status=" + status +
				", startDate=" + startDate +
				", endDate=" + endDate +
				", sessionsPerWeek=" + sessionsPerWeek +
				", daysOfWeek=" + (daysOfWeek == null ? null : String.join(",", daysOfWeek)) +
				", sessionStartTime=" + sessionStartTime +
				", sessionEndTime=" + sessionEndTime + "]";
	}

	
}
