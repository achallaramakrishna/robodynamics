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

@Entity
@Table(name = "rd_course_contents")
public class RDCourseContent {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_content_id")
	private int courseContentId;
	
	@Column(name = "course_content_title")
	private String courseContentTitle;
	
	@Column(name = "course_content_data")
	private String courseContentData;
	
	@Column(name = "creation_date")
	private Date creationDate;
	
	@Column(name = "version")
	private int version;
	
	@ManyToOne
    @JoinColumn(name = "course_id")
    private RDCourse course;

	public int getCourseContentId() {
		return courseContentId;
	}

	public void setCourseContentId(int courseContentId) {
		this.courseContentId = courseContentId;
	}

	public String getCourseContentTitle() {
		return courseContentTitle;
	}

	public void setCourseContentTitle(String courseContentTitle) {
		this.courseContentTitle = courseContentTitle;
	}

	public String getCourseContentData() {
		return courseContentData;
	}

	public void setCourseContentData(String courseContentData) {
		this.courseContentData = courseContentData;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public RDCourse getCourse() {
		return course;
	}

	public void setCourse(RDCourse course) {
		this.course = course;
	}
	
	
	
}
