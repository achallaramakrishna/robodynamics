package com.robodynamics.wrapper;

import java.util.List;

public class ExamCourseJson {
    private int courseId;
    private String sectionName;
    private int totalMarks;
    private List<QuestionJson> questions;
	public int getCourseId() {
		return courseId;
	}
	public void setCourseId(int courseId) {
		this.courseId = courseId;
	}
	public String getSectionName() {
		return sectionName;
	}
	public void setSectionName(String sectionName) {
		this.sectionName = sectionName;
	}
	public int getTotalMarks() {
		return totalMarks;
	}
	public void setTotalMarks(int totalMarks) {
		this.totalMarks = totalMarks;
	}
	public List<QuestionJson> getQuestions() {
		return questions;
	}
	public void setQuestions(List<QuestionJson> questions) {
		this.questions = questions;
	}

    
    
}
