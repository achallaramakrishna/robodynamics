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


@Entity
@Table(name = "rd_course_session_details")
public class RDCourseSessionDetail {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_session_detail_id")
	private int courseSessionDetailId;
	
	@Column(name = "session_id")
	private int sessionId;
	
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

	public int getSessionId() {
		return sessionId;
	}

	public void setSessionId(int sessionId) {
		this.sessionId = sessionId;
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

	
	@Override
	public String toString() {
		return "RDCourseSessionDetail [courseSessionDetailId=" + courseSessionDetailId + ", sessionId=" + sessionId
				+ ", course=" + course + ", courseSession=" + courseSession + ", topic=" + topic + ", type=" + type
				+ ", file=" + file + ", creationDate=" + creationDate + ", version=" + version + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(course, courseSession, courseSessionDetailId, creationDate, file, sessionId, topic, type,
				version);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RDCourseSessionDetail other = (RDCourseSessionDetail) obj;
		return Objects.equals(course, other.course) && Objects.equals(courseSession, other.courseSession)
				&& courseSessionDetailId == other.courseSessionDetailId
				&& Objects.equals(creationDate, other.creationDate) && Objects.equals(file, other.file)
				&& sessionId == other.sessionId && Objects.equals(topic, other.topic)
				&& Objects.equals(type, other.type) && version == other.version;
	}

	

}

















