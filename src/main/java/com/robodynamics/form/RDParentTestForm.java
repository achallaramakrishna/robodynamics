package com.robodynamics.form;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.robodynamics.model.RDTestMode;
import com.robodynamics.model.RDTestType;

public class RDParentTestForm {
	  private Integer courseId;
	  private String  testTitle;
	  private RDTestType testType;
	  private Integer totalMarks;
	  private Integer passingMarks;
	  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) private LocalDateTime startAt;
	  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) private LocalDateTime endAt;
	  private RDTestMode mode;
	  private String venue;
	  private java.util.List<Integer> detailIds;
	public Integer getCourseId() {
		return courseId;
	}
	public void setCourseId(Integer courseId) {
		this.courseId = courseId;
	}
	public String getTestTitle() {
		return testTitle;
	}
	public void setTestTitle(String testTitle) {
		this.testTitle = testTitle;
	}
	public RDTestType getTestType() {
		return testType;
	}
	public void setTestType(RDTestType testType) {
		this.testType = testType;
	}
	public Integer getTotalMarks() {
		return totalMarks;
	}
	public void setTotalMarks(Integer totalMarks) {
		this.totalMarks = totalMarks;
	}
	public Integer getPassingMarks() {
		return passingMarks;
	}
	public void setPassingMarks(Integer passingMarks) {
		this.passingMarks = passingMarks;
	}
	public LocalDateTime getStartAt() {
		return startAt;
	}
	public void setStartAt(LocalDateTime startAt) {
		this.startAt = startAt;
	}
	public LocalDateTime getEndAt() {
		return endAt;
	}
	public void setEndAt(LocalDateTime endAt) {
		this.endAt = endAt;
	}
	public RDTestMode getMode() {
		return mode;
	}
	public void setMode(RDTestMode mode) {
		this.mode = mode;
	}
	public String getVenue() {
		return venue;
	}
	public void setVenue(String venue) {
		this.venue = venue;
	}
	public java.util.List<Integer> getDetailIds() {
		return detailIds;
	}
	public void setDetailIds(java.util.List<Integer> detailIds) {
		this.detailIds = detailIds;
	}
	  
	  
	  // getters/setters
	
	  
}