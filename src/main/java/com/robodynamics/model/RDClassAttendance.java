package com.robodynamics.model;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_class_attendance")
public class RDClassAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private int attendanceId;

    @ManyToOne
    @JoinColumn(name = "class_session_id", nullable = false)
    private RDClassSession classSession;  // ✅ Link attendance to a class session

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private RDUser student;  // ✅ Student who attended or missed

    @Column(name = "attendance_status")
    private int attendanceStatus; // 1=Present, 2=Absent

    @Temporal(TemporalType.DATE)
    @Column(name = "attendance_date", nullable = false)
    private Date attendanceDate;
    
    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private RDStudentEnrollment enrollment;  // new field


    @Column(name = "attendance_time")
    private LocalDateTime attendanceTime;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enum for readable status
    public enum StatusType {
        PRESENT(1, "Present"),
        ABSENT(2, "Absent");

        private final int value;
        private final String label;

        StatusType(int value, String label) {
            this.value = value;
            this.label = label;
        }

        public int getValue() { return value; }
        public String getLabel() { return label; }
    }

	public int getAttendanceId() {
		return attendanceId;
	}

	public void setAttendanceId(int attendanceId) {
		this.attendanceId = attendanceId;
	}

	public RDClassSession getClassSession() {
		return classSession;
	}

	public void setClassSession(RDClassSession classSession) {
		this.classSession = classSession;
	}

	public RDUser getStudent() {
		return student;
	}

	public void setStudent(RDUser student) {
		this.student = student;
	}

	public int getAttendanceStatus() {
		return attendanceStatus;
	}

	public void setAttendanceStatus(int attendanceStatus) {
		this.attendanceStatus = attendanceStatus;
	}

	public Date getAttendanceDate() {
		return attendanceDate;
	}

	public void setAttendanceDate(Date attendanceDate) {
		this.attendanceDate = attendanceDate;
	}

	public LocalDateTime getAttendanceTime() {
		return attendanceTime;
	}

	public void setAttendanceTime(LocalDateTime attendanceTime) {
		this.attendanceTime = attendanceTime;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public RDStudentEnrollment getEnrollment() {
		return enrollment;
	}

	public void setEnrollment(RDStudentEnrollment enrollment) {
		this.enrollment = enrollment;
	}
	
	
    
}
