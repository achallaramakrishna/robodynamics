package com.robodynamics.dto;

public class RDCourseOfferingDTO {
    private int courseOfferingId;
    private String courseOfferingName;   // <- changed
    private java.util.Date startDate;
    private java.util.Date endDate;

    public RDCourseOfferingDTO() {}

    public RDCourseOfferingDTO(int courseOfferingId, String courseOfferingName,
                               java.util.Date startDate, java.util.Date endDate) {
        this.courseOfferingId = courseOfferingId;
        this.courseOfferingName = courseOfferingName; // <- changed
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public int getCourseOfferingId() { return courseOfferingId; }
    public void setCourseOfferingId(int id) { this.courseOfferingId = id; }

    public String getCourseOfferingName() { return courseOfferingName; } // <- changed
    public void setCourseOfferingName(String name) { this.courseOfferingName = name; } // <- changed

    public java.util.Date getStartDate() { return startDate; }
    public void setStartDate(java.util.Date d) { this.startDate = d; }

    public java.util.Date getEndDate() { return endDate; }
    public void setEndDate(java.util.Date d) { this.endDate = d; }
}
