package com.robodynamics.model;


import java.beans.Transient;
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

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "rd_course_session_details")
public class RDCourseSessionDetail {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_session_detail_id")
	private int courseSessionDetailId;
	
	@ManyToOne
    @JoinColumn(name = "course_id")
    private RDCourse course;
	
	@ManyToOne
    @JoinColumn(name = "course_session_id")
    private RDCourseSession courseSession;
	
	@Column(name = "topic")
	private String topic;
	
	@Column(name = "type")
    private String type; // video or pdf
	
	@Column(name = "file")
    private String file;

	@Column(name = "creation_date")
	private Date creationDate;
	
	@Column(name = "version")
	private int version;
	
	@ManyToOne
    @JoinColumn(name = "quiz_id")
    private RDQuiz quiz;

	 @OneToMany(mappedBy = "courseSessionDetail", cascade = CascadeType.ALL,orphanRemoval = true) 
	 @JsonIgnore
	 private List<RDSlide> slides;
	
	 
	public List<RDSlide> getSlides() {
		return slides;
	}

	public void setSlides(List<RDSlide> slides) {
		this.slides = slides;
	}

	public RDQuiz getQuiz() {
		return quiz;
	}

	public void setQuiz(RDQuiz quiz) {
		this.quiz = quiz;
	}

	public int getCourseSessionDetailId() {
		return courseSessionDetailId;
	}

	public void setCourseSessionDetailId(int courseSessionDetailId) {
		this.courseSessionDetailId = courseSessionDetailId;
	}

	public RDCourse getCourse() {
		return course;
	}

	public void setCourse(RDCourse course) {
		this.course = course;
	}

	public RDCourseSession getCourseSession() {
		return courseSession;
	}

	public void setCourseSession(RDCourseSession courseSession) {
		this.courseSession = courseSession;
	}

	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getFile() {
		return file;
	}

	public void setFile(String file) {
		this.file = file;
	}

}

















