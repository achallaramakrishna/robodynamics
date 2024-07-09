package com.robodynamics.model;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_course_resources")
public class RDCourseResource {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_resource_id")
	private int courseResourceId;
	
	@Column(name = "course_resource_file_name")
	private String courseResourceFileName;
	
	@Column(name = "course_resource_type")
	private String courseResourceType;
	
	
	@ManyToOne
    @JoinColumn(name = "course_id")
    private RDCourse course;
	
	@ManyToOne
    @JoinColumn(name = "course_content_id")
    private RDCourseContent courseContent;
	
	
	
	public int getCourseResourceId() {
		return courseResourceId;
	}

	public void setCourseResourceId(int courseResourceId) {
		this.courseResourceId = courseResourceId;
	}

	public String getCourseResourceFileName() {
		return courseResourceFileName;
	}

	public RDCourseResource() {
		
	}

	public String getCourseResourceType() {
		return courseResourceType;
	}

	public void setCourseResourceType(String courseResourceType) {
		this.courseResourceType = courseResourceType;
	}

	public void setAssetResourceFileName(String courseResourceFileName) {
		this.courseResourceFileName = courseResourceFileName;
	}

	public RDCourse getCourse() {
		return course;
	}

	public void setCourse(RDCourse course) {
		this.course = course;
	}

	public RDCourseContent getCourseContent() {
		return courseContent;
	}

	public void setCourseContent(RDCourseContent courseContent) {
		this.courseContent = courseContent;
	}

	public void setCourseResourceFileName(String courseResourceFileName) {
		this.courseResourceFileName = courseResourceFileName;
	}
	
	

}
