package com.robodynamics.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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

    @Column(name = "end_date")
    @JsonProperty("end")
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date endDate;

    @Column(name = "course_offering_name")
    @JsonProperty("courseOfferingName")
    private String courseOfferingName;

    @Column(name = "title")
    @JsonProperty("title")
    private String title;

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

    // Getters and Setters

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

    public String getCourseOfferingName() {
        return courseOfferingName;
    }

    public void setCourseOfferingName(String courseOfferingName) {
        this.courseOfferingName = courseOfferingName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

	@Override
	public String toString() {
		return "RDCourseOffering [courseOfferingId=" + courseOfferingId + ", startDate=" + startDate + ", endDate="
				+ endDate + ", courseOfferingName=" + courseOfferingName + ", title=" + title + ", status=" + status
				+ ", course=" + course + ", instructor=" + instructor + "]";
	}

    

    
}
