package com.robodynamics.dto;

public class RDCourseOfferingDTO {
    private int courseOfferingId;
    private String courseOfferingName;
    private String start;       // "yyyy-MM-dd"
    private String end;         // "yyyy-MM-dd"
    private String mentorName;  // or instructorName if you prefer
    private String timeRange;   // e.g., "20:22 - 21:22"
    private Double feeAmount;
    private String daysOfWeek;

    public int getCourseOfferingId() { return courseOfferingId; }
    public void setCourseOfferingId(int id) { this.courseOfferingId = id; }

    public String getCourseOfferingName() { return courseOfferingName; }
    public void setCourseOfferingName(String name) { this.courseOfferingName = name; }

    public String getStart() { return start; }
    public void setStart(String start) { this.start = start; }

    public String getEnd() { return end; }
    public void setEnd(String end) { this.end = end; }

    public String getMentorName() { return mentorName; }
    public void setMentorName(String mentorName) { this.mentorName = mentorName; }

    public String getTimeRange() { return timeRange; }
    public void setTimeRange(String timeRange) { this.timeRange = timeRange; }

    public Double getFeeAmount() { return feeAmount; }
    public void setFeeAmount(Double feeAmount) { this.feeAmount = feeAmount; }
	public void setDaysOfWeek(String daysOfWeek) {
		
		this.daysOfWeek = daysOfWeek;
	}
}
