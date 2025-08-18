package com.robodynamics.form;

import java.time.LocalDate;
import java.util.List;

import com.robodynamics.model.RDTestMode;

public class RDTestCreateForm {
	
	private Integer testId;
	
    private Integer courseId;
    private String  testTitle;
    private String  testType;       // UNIT/MIDTERM/FINAL/PRACTICE/MOCK
    private Integer totalMarks;
    private Integer passingMarks;
    private LocalDate testDate;     // <input type="date">
    private List<Integer> sessionIds; // selected sessions (checkboxes)

    private RDTestMode mode; // or private String mode;
    

    // --- NEW: make JSP happy ---
    private String venue;             // 👈 add this

    

    public String getVenue() {
		return venue;
	}
	public void setVenue(String venue) {
		this.venue = venue;
	}
	public RDTestMode getMode() { return mode; }
    public void setMode(RDTestMode mode) { this.mode = mode; }

    
    
    public Integer getTestId() {
		return testId;
	}
	public void setTestId(Integer testId) {
		this.testId = testId;
	}
	public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }
    public String getTestTitle() { return testTitle; }
    public void setTestTitle(String testTitle) { this.testTitle = testTitle; }
    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }
    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }
    public Integer getPassingMarks() { return passingMarks; }
    public void setPassingMarks(Integer passingMarks) { this.passingMarks = passingMarks; }
    public LocalDate getTestDate() { return testDate; }
    public void setTestDate(LocalDate testDate) { this.testDate = testDate; }
    public List<Integer> getSessionIds() { return sessionIds; }
    public void setSessionIds(List<Integer> sessionIds) { this.sessionIds = sessionIds; }
}
