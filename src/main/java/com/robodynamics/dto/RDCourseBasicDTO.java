package com.robodynamics.dto;

import java.math.BigDecimal;

public class RDCourseBasicDTO {

    private int courseId;
    private String courseName;
    private String courseDescription;
    private String courseDuration;
    private String courseLevel;
    private String courseImageUrl;
    private BigDecimal coursePrice;
    private String courseInstructor;
    private String courseAgeGroup;
    private String category;
    private String gradeRangeDisplayName;

	// Constructor with the required parameter types and order
	public RDCourseBasicDTO(int courseId, String courseName, String courseDescription, String courseDuration,
			String courseLevel, String courseImageUrl, BigDecimal coursePrice, String courseInstructor,
			String courseAgeGroup, String category, String gradeRangeDisplayName) {
		this.courseId = courseId;
		this.courseName = courseName;
		this.courseDescription = courseDescription;
		this.courseDuration = courseDuration;
		this.courseLevel = courseLevel;
		this.courseImageUrl = courseImageUrl;
		this.coursePrice = coursePrice;
		this.courseInstructor = courseInstructor;
		this.courseAgeGroup = courseAgeGroup;
		this.category = category;
		this.gradeRangeDisplayName = gradeRangeDisplayName;
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

	public String getCourseDescription() {
		return courseDescription;
	}

	public void setCourseDescription(String courseDescription) {
		this.courseDescription = courseDescription;
	}

	public String getCourseDuration() {
		return courseDuration;
	}

	public void setCourseDuration(String courseDuration) {
		this.courseDuration = courseDuration;
	}

	public String getCourseLevel() {
		return courseLevel;
	}

	public void setCourseLevel(String courseLevel) {
		this.courseLevel = courseLevel;
	}

	public String getCourseImageUrl() {
		return courseImageUrl;
	}

	public void setCourseImageUrl(String courseImageUrl) {
		this.courseImageUrl = courseImageUrl;
	}

	public BigDecimal getCoursePrice() {
		return coursePrice;
	}

	public void setCoursePrice(BigDecimal coursePrice) {
		this.coursePrice = coursePrice;
	}

	public String getCourseInstructor() {
		return courseInstructor;
	}

	public void setCourseInstructor(String courseInstructor) {
		this.courseInstructor = courseInstructor;
	}

	public String getCourseAgeGroup() {
		return courseAgeGroup;
	}

	public void setCourseAgeGroup(String courseAgeGroup) {
		this.courseAgeGroup = courseAgeGroup;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getGradeRangeDisplayName() {
		return gradeRangeDisplayName;
	}

	public void setGradeRangeDisplayName(String gradeRangeDisplayName) {
		this.gradeRangeDisplayName = gradeRangeDisplayName;
	}
	
    
}
