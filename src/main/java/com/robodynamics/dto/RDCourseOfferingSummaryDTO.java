package com.robodynamics.dto;

import java.util.Date;

public class RDCourseOfferingSummaryDTO {

    private int courseId;
    private String courseName;

    private int courseOfferingId;
    private String courseOfferingName;

    private String mentorFullName;     // the trimmed/concat’d name
    private Date startDate;
    private Date endDate;
    private String status;

    private long enrolledCount;        // NOTE: long, not int

    public RDCourseOfferingSummaryDTO(
            int courseId,
            String courseName,
            int courseOfferingId,
            String courseOfferingName,
            String mentorFullName,
            Date startDate,
            Date endDate,
            String status,
            long enrolledCount) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseOfferingId = courseOfferingId;
        this.courseOfferingName = courseOfferingName;
        this.mentorFullName = mentorFullName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.enrolledCount = enrolledCount;
    }

    // getters (and setters if you need them)
    public int getCourseId() { return courseId; }
    public String getCourseName() { return courseName; }
    public int getCourseOfferingId() { return courseOfferingId; }
    public String getCourseOfferingName() { return courseOfferingName; }
    public String getMentorFullName() { return mentorFullName; }
    public Date getStartDate() { return startDate; }
    public Date getEndDate() { return endDate; }
    public String getStatus() { return status; }
    public long getEnrolledCount() { return enrolledCount; }
}
