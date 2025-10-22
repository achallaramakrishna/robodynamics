package com.robodynamics.form;

import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

public class RDStudentEnrollmentForm {
	
	private int enrollmentId;

	private int courseOfferingId;
	private int courseId;
	private String courseName;
	private int studentId;
	
	private int parentId;
	
	private int status;

    private String startDate;
    
    private String endDate;
    
    private Double discountPercent;
    private String discountReason;
    private Double finalFee;

    
    public RDStudentEnrollmentForm() {
    	
    }
	public Double getDiscountPercent() {
		return discountPercent;
	}
	public void setDiscountPercent(Double discountPercent) {
		this.discountPercent = discountPercent;
	}
	public String getDiscountReason() {
		return discountReason;
	}
	public void setDiscountReason(String discountReason) {
		this.discountReason = discountReason;
	}
	public Double getFinalFee() {
		return finalFee;
	}
	public void setFinalFee(Double finalFee) {
		this.finalFee = finalFee;
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
	
	
	
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
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
	public int getStudentId() {
		return studentId;
	}
	public void setStudentId(int studentId) {
		this.studentId = studentId;
	}
	public int getParentId() {
		return parentId;
	}
	public void setParentId(int parentId) {
		this.parentId = parentId;
	}
	public int getEnrollmentId() {
		return enrollmentId;
	}
	public void setEnrollmentId(int enrollmentId) {
		this.enrollmentId = enrollmentId;
	}
	
	
	
	
	


}
