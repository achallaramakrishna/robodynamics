package com.robodynamics.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

/**
 * DTO for per-session course tracking shown on the Parent Dashboard. Keep this
 * DTO UI-friendly: strings for text fields, LocalDate for dates, and nullable
 * numbers.
 */
public class RDCourseTrackingDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	// Identifiers / relations
	private Integer trackingId; // optional: DB id of tracking row
	private Integer enrollmentId; // which student's enrollment this belongs to
	private Integer classSessionId; // session reference (if any)

	// Display fields
	private Date trackingDate; // e.g., 2025-08-09
	private String sessionName; // optional: "Session 5 - Fractions"
	private String topic; // e.g., "Fractions: LCM & HCF"
	private String activities; // e.g., "Worksheet-2, Group quiz"
	private String homework; // e.g., "Pg 14 Q1-10"
	private String remarks; // mentor notes (optional)
	private Integer score; // nullable: 0–100 (or whatever your scale is)
	private String mentorName; // optional display

	public RDCourseTrackingDTO() {
	}

	public RDCourseTrackingDTO(Integer trackingId, Integer enrollmentId, Integer classSessionId,
			java.time.LocalDate trackingDate, // LocalDate input
			String sessionName, String remarks, String mentorName) {
		this.trackingId = trackingId;
		this.enrollmentId = enrollmentId;
		this.classSessionId = classSessionId;
// keep the DTO field as java.util.Date;
// convert LocalDate -> java.sql.Date for date-only semantics
		this.trackingDate = (trackingDate == null ? null : java.sql.Date.valueOf(trackingDate));
		this.sessionName = sessionName;
		this.remarks = remarks;
		this.mentorName = mentorName;
// the other DTO fields (topic, activities, homework, score) remain null by default
	}

	public RDCourseTrackingDTO(Integer trackingId, Integer enrollmentId, Integer classSessionId, Date trackingDate,
			String sessionName, String topic, String activities, String homework, String remarks, Integer score,
			String mentorName) {
		this.trackingId = trackingId;
		this.enrollmentId = enrollmentId;
		this.classSessionId = classSessionId;
		this.trackingDate = trackingDate;
		this.sessionName = sessionName;
		this.topic = topic;
		this.activities = activities;
		this.homework = homework;
		this.remarks = remarks;
		this.score = score;
		this.mentorName = mentorName;
	}

	// --- Minimal convenience constructor commonly used in mappers ---
	public RDCourseTrackingDTO(Integer enrollmentId, Date trackingDate, String topic, String activities,
			String homework, Integer score) {
		this.enrollmentId = enrollmentId;
		this.trackingDate = trackingDate;
		this.topic = topic;
		this.activities = activities;
		this.homework = homework;
		this.score = score;
	}

	// --- Getters & Setters ---

	public Integer getTrackingId() {
		return trackingId;
	}

	public void setTrackingId(Integer trackingId) {
		this.trackingId = trackingId;
	}

	public Integer getEnrollmentId() {
		return enrollmentId;
	}

	public void setEnrollmentId(Integer enrollmentId) {
		this.enrollmentId = enrollmentId;
	}

	public Integer getClassSessionId() {
		return classSessionId;
	}

	public void setClassSessionId(Integer classSessionId) {
		this.classSessionId = classSessionId;
	}

	public Date getTrackingDate() {
		return trackingDate;
	}

	public void setTrackingDate(Date trackingDate) {
		this.trackingDate = trackingDate;
	}

	public String getSessionName() {
		return sessionName;
	}

	public void setSessionName(String sessionName) {
		this.sessionName = sessionName;
	}

	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public String getActivities() {
		return activities;
	}

	public void setActivities(String activities) {
		this.activities = activities;
	}

	public String getHomework() {
		return homework;
	}

	public void setHomework(String homework) {
		this.homework = homework;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public String getMentorName() {
		return mentorName;
	}

	public void setMentorName(String mentorName) {
		this.mentorName = mentorName;
	}

	@Override
	public String toString() {
		return "RDCourseTrackingDTO{" + "trackingId=" + trackingId + ", enrollmentId=" + enrollmentId
				+ ", classSessionId=" + classSessionId + ", trackingDate=" + trackingDate + ", sessionName='"
				+ sessionName + '\'' + ", topic='" + topic + '\'' + ", activities='" + activities + '\''
				+ ", homework='" + homework + '\'' + ", remarks='" + remarks + '\'' + ", score=" + score
				+ ", mentorName='" + mentorName + '\'' + '}';
	}
}
