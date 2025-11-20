package com.robodynamics.dto;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.sql.Timestamp;

public class RDAttendanceFlatRowDTO {
    private Integer offeringId;
    private String  offeringName;
    private String  mentorName;

    private Integer studentId;
    private String  studentName;

    private LocalDate sessionDate;
    private String    weekday;           // Mon/Tue/...

    private LocalTime sessionStartTime;
    private LocalTime sessionEndTime;

    // Attendance (latest entry for that date)
    private String    attendanceOnDate;  // "Present" | "Absent" | "—"
    private Timestamp attendanceMarkedAt;

    // Tracking (latest entry for that date)
    private String    feedbackOnDate;    // may be null/empty
    private Integer   trackingSessionIdOnDate; // nullable
    private String    trackingMarkedBy;  // mentor name who saved tracking
    private Timestamp trackingMarkedAt;
    
    private String trackingSessionTitle;
    
    public String getSessionStartTimeFormatted() {
        if (sessionStartTime == null) return "";
        return sessionStartTime.format(DateTimeFormatter.ofPattern("hh:mm a"));
    }

    public String getSessionEndTimeFormatted() {
        if (sessionEndTime == null) return "";
        return sessionEndTime.format(DateTimeFormatter.ofPattern("hh:mm a"));
    }



    
	
	public String getTrackingSessionTitle() {
		return trackingSessionTitle;
	}
	public void setTrackingSessionTitle(String trackingSessionTitle) {
		this.trackingSessionTitle = trackingSessionTitle;
	}
	public Integer getOfferingId() {
		return offeringId;
	}
	public void setOfferingId(Integer offeringId) {
		this.offeringId = offeringId;
	}
	public String getOfferingName() {
		return offeringName;
	}
	public void setOfferingName(String offeringName) {
		this.offeringName = offeringName;
	}
	public String getMentorName() {
		return mentorName;
	}
	public void setMentorName(String mentorName) {
		this.mentorName = mentorName;
	}
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public String getStudentName() {
		return studentName;
	}
	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}
	public LocalDate getSessionDate() {
		return sessionDate;
	}
	public void setSessionDate(LocalDate sessionDate) {
		this.sessionDate = sessionDate;
	}
	public String getWeekday() {
		return weekday;
	}
	public void setWeekday(String weekday) {
		this.weekday = weekday;
	}
	public LocalTime getSessionStartTime() {
		return sessionStartTime;
	}
	public void setSessionStartTime(LocalTime sessionStartTime) {
		this.sessionStartTime = sessionStartTime;
	}
	public LocalTime getSessionEndTime() {
		return sessionEndTime;
	}
	public void setSessionEndTime(LocalTime sessionEndTime) {
		this.sessionEndTime = sessionEndTime;
	}
	public String getAttendanceOnDate() {
		return attendanceOnDate;
	}
	public void setAttendanceOnDate(String attendanceOnDate) {
		this.attendanceOnDate = attendanceOnDate;
	}
	public Timestamp getAttendanceMarkedAt() {
		return attendanceMarkedAt;
	}
	public void setAttendanceMarkedAt(Timestamp attendanceMarkedAt) {
		this.attendanceMarkedAt = attendanceMarkedAt;
	}
	public String getFeedbackOnDate() {
		return feedbackOnDate;
	}
	public void setFeedbackOnDate(String feedbackOnDate) {
		this.feedbackOnDate = feedbackOnDate;
	}
	public Integer getTrackingSessionIdOnDate() {
		return trackingSessionIdOnDate;
	}
	public void setTrackingSessionIdOnDate(Integer trackingSessionIdOnDate) {
		this.trackingSessionIdOnDate = trackingSessionIdOnDate;
	}
	public String getTrackingMarkedBy() {
		return trackingMarkedBy;
	}
	public void setTrackingMarkedBy(String trackingMarkedBy) {
		this.trackingMarkedBy = trackingMarkedBy;
	}
	public Timestamp getTrackingMarkedAt() {
		return trackingMarkedAt;
	}
	public void setTrackingMarkedAt(Timestamp trackingMarkedAt) {
		this.trackingMarkedAt = trackingMarkedAt;
	}

   
}
