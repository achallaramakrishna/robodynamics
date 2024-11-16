package com.robodynamics.wrapper;

import java.util.List;

public class ExamPaperJson {
    private String examName;
    private String examCode;
    private int examYear;
    private int totalMarks;
    private String examLevel;
    private String examInstructions;
    private String description;
    private List<ExamCourseJson> examCourses;
	public String getExamName() {
		return examName;
	}
	public void setExamName(String examName) {
		this.examName = examName;
	}
	
	
	public String getExamCode() {
		return examCode;
	}
	public void setExamCode(String examCode) {
		this.examCode = examCode;
	}
	public int getExamYear() {
		return examYear;
	}
	public void setExamYear(int examYear) {
		this.examYear = examYear;
	}
	public int getTotalMarks() {
		return totalMarks;
	}
	public void setTotalMarks(int totalMarks) {
		this.totalMarks = totalMarks;
	}
	public String getExamLevel() {
		return examLevel;
	}
	public void setExamLevel(String examLevel) {
		this.examLevel = examLevel;
	}
	public String getExamInstructions() {
		return examInstructions;
	}
	public void setExamInstructions(String examInstructions) {
		this.examInstructions = examInstructions;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<ExamCourseJson> getExamCourses() {
		return examCourses;
	}
	public void setExamCourses(List<ExamCourseJson> examCourses) {
		this.examCourses = examCourses;
	}
    
    
    
}
