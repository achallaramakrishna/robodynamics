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
	
	@Column(name = "attendance_status")
	private int attendance_status;
	
	@Column(name = "notes")
	private String notes;
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "course_session_detail_id")
    private RDCourseSessionDetail courseSessionDetail;
	
	@ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "enrollment_id")
    private RDStudentEnrollment studentEnrollment;
	
	
	
	public RDStudentEnrollment getStudentEnrollment() {
		return studentEnrollment;
	}

	public void setStudentEnrollment(RDStudentEnrollment studentEnrollment) {
		this.studentEnrollment = studentEnrollment;
	}

	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private RDUser user;
	
	@Temporal(TemporalType.DATE)
    @Column(name = "attendance_date", nullable = false)
    private Date attendanceDate;

    @Column(name = "attendance_time")
    private LocalDateTime attendanceTime;
	
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
	
	public static enum statusType {
		Present(1, "PRESENT"), Absent(2, "ABSENT");
		
		private int value;
		private String label;
		 
		private statusType(int value, String label) {
			this.value = value;
			this.label = label;
		}
		 
		public int getValue() {
		  return value;
		}
		
		public String getLabel() {
			return label;
		}
		
		public static Map<Integer, String> getMap() {
			Map<Integer, String> map  = new LinkedHashMap<Integer, String>();
			for (statusType type: statusType.values()) {				
				map.put(type.getValue(), type.getLabel());
			}
			return map;
		}
	}


	public RDClassAttendance() {
		
	}

	public int getAttendanceId() {
		return attendanceId;
	}

	public void setAttendanceId(int attendanceId) {
		this.attendanceId = attendanceId;
	}

	

	public int getAttendance_status() {
		return attendance_status;
	}

	public void setAttendance_status(int attendance_status) {
		this.attendance_status = attendance_status;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public RDUser getUser() {
		return user;
	}

	public void setUser(RDUser user) {
		this.user = user;
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

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public RDCourseSessionDetail getCourseSessionDetail() {
		return courseSessionDetail;
	}

	public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
		this.courseSessionDetail = courseSessionDetail;
	}

	


	


}
