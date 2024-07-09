package com.robodynamics.form;

import org.springframework.web.multipart.MultipartFile;

public class RDCourseForm {

	private int courseId;
	private String courseName;
	private int courseCategoryId;
    private MultipartFile imageFile;
    
    
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


	public int getCourseCategoryId() {
		return courseCategoryId;
	}


	public void setCourseCategoryId(int courseCategoryId) {
		this.courseCategoryId = courseCategoryId;
	}


	public MultipartFile getImageFile() {
		return imageFile;
	}


	public void setImageFile(MultipartFile imageFile) {
		this.imageFile = imageFile;
	}


	public RDCourseForm() {
    	
    }
	
}
