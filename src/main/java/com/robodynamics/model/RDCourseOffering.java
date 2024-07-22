package com.robodynamics.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "rd_course_offerings")
@JsonRootName("event")
public class RDCourseOffering {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_offering_id")
    @JsonProperty("id")
	private int courseOfferingId;
	
	@Column(name = "start_date")
	@JsonProperty("start")
    @JsonFormat(pattern="yyyy-MM-dd")
	private Date startDate;
	
	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "course_offering_name")
    @JsonProperty("courseOfferingName")
	private String courseOfferingName;

	@Column(name = "title")
    @JsonProperty("title")
	private String title;
	
	@Column(name = "end_date")
	@JsonProperty("end")
    @JsonFormat(pattern="yyyy-MM-dd")
	private Date endDate;
	
	@Column(name = "status")
	@JsonIgnore
	private String status;
	
	@ManyToOne
    @JoinColumn(name = "course_id")
	@JsonIgnore
    private RDCourse course;
	
	
	@ManyToOne
    @JoinColumn(name = "instructor_id")
	@JsonIgnore
    private RDUser instructor;
	
	
	public RDCourseOffering() {
		
	}


	public int getCourseOfferingId() {
		return courseOfferingId;
	}


	public void setCourseOfferingId(int courseOfferingId) {
		this.courseOfferingId = courseOfferingId;
	}


	public Date getStartDate() {
		return startDate;
	}


	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}


	public Date getEndDate() {
		return endDate;
	}


	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}


	public RDCourse getCourse() {
		return course;
	}


	public void setCourse(RDCourse course) {
		this.course = course;
	}


	public RDUser getInstructor() {
		return instructor;
	}


	public void setInstructor(RDUser instructor) {
		this.instructor = instructor;
	}
	
	


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getCourseOfferingName() {
		return courseOfferingName;
	}


	public void setCourseOfferingName(String courseOfferingName) {
		this.courseOfferingName = courseOfferingName;
	}


	@Override
	public String toString() {
		return "RDCourseOffering [courseOfferingId=" + courseOfferingId + ", startDate=" + startDate
				+ ", courseOfferingName=" + courseOfferingName + ", title=" + title + ", endDate=" + endDate
				+ ", status=" + status + ", course=" + course + ", instructor=" + instructor + "]";
	}


		


	
	
}
