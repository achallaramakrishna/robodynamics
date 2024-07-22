package com.robodynamics.form;

import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

public class RDCourseOfferingForm {

	private int courseOfferingId;
	private String courseOfferingName;
	private int courseId;
	private String courseName;
	private int userID;
	private String status;

    private String startDate;
    
    private String endDate;
    
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
	@Override
	public String toString() {
		return "RDCourseOfferingForm [courseOfferingId=" + courseOfferingId + ", courseOfferingName="
				+ courseOfferingName + ", courseId=" + courseId + ", courseName=" + courseName + ", userID=" + userID
				+ ", status=" + status + ", startDate=" + startDate + ", endDate=" + endDate + "]";
	}
	
	


}
