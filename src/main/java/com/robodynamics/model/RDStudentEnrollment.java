package com.robodynamics.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

@Entity
@Table(name = "rd_student_enrollments")
public class RDStudentEnrollment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "enrollment_id")
	private int enrollmentId;
	
	
	@ManyToOne
    @JoinColumn(name = "course_offering_id")
    private RDCourseOffering courseOffering;
	
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name="attendance_id", nullable = true)
	@JsonIgnore	
	private Set<RDClassAttendance> attendances = new TreeSet<RDClassAttendance>();

	
	@ManyToOne
    @JoinColumn(name = "student_id")
    private RDUser student;
	
	@ManyToOne
    @JoinColumn(name = "parent_id")
    private RDUser parent;
	
	
	@Column(name = "enrollment_date")
	private Date enrollmentDate;
	
	@Column(name = "status")
	private int status;
	
	@Column(name = "progress")
	private double progress;
	
	public RDStudentEnrollment() {
		
	}

	public int getEnrollmentId() {
		return enrollmentId;
	}

	public void setEnrollmentId(int enrollmentId) {
		this.enrollmentId = enrollmentId;
	}

	public RDCourseOffering getCourseOffering() {
		return courseOffering;
	}

	public void setCourseOffering(RDCourseOffering courseOffering) {
		this.courseOffering = courseOffering;
	}

	public Set<RDClassAttendance> getAttendances() {
		return attendances;
	}

	public void setAttendances(Set<RDClassAttendance> attendances) {
		this.attendances = attendances;
	}

	public RDUser getStudent() {
		return student;
	}

	public void setStudent(RDUser student) {
		this.student = student;
	}

	public RDUser getParent() {
		return parent;
	}

	public void setParent(RDUser parent) {
		this.parent = parent;
	}

	public Date getEnrollmentDate() {
		return enrollmentDate;
	}

	public void setEnrollmentDate(Date enrollmentDate) {
		this.enrollmentDate = enrollmentDate;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	
	

	public double getProgress() {
		return progress;
	}

	public void setProgress(double progress) {
		this.progress = progress;
	}

	@Override
	public String toString() {
		return "RDStudentEnrollment [enrollmentId=" + enrollmentId + ", courseOffering=" + courseOffering + ", student="
				+ student + ", parent=" + parent + ", enrollmentDate=" + enrollmentDate + ", status=" + status + "]";
	}

	
	
	
	
}
