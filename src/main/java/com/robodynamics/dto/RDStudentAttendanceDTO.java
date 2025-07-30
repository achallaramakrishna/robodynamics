package com.robodynamics.dto;

public class RDStudentAttendanceDTO {

	private int userID;
    private String firstName;
    private String attendanceStatus; // Present, Absent, Not Marked
    
    private Integer enrollmentId;
    
    private int classSessionId;   // ✅ Add this

    
    public int getClassSessionId() {
		return classSessionId;
	}

	public void setClassSessionId(int classSessionId) {
		this.classSessionId = classSessionId;
	}

	public Integer getEnrollmentId() {
        return enrollmentId;
    }
    
    public void setEnrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
    }
	public int getUserID() {
		return userID;
	}
	public void setUserID(int userID) {
		this.userID = userID;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getAttendanceStatus() {
		return attendanceStatus;
	}
	public void setAttendanceStatus(String attendanceStatus) {
		this.attendanceStatus = attendanceStatus;
	}
    
}
