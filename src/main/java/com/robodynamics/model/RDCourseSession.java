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
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;


@Entity
@Table(name = "rd_course_sessions")
public class RDCourseSession {
	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_session_id")
	private int courseSessionId;

	@Column(name = "session_id")
	private int sessionId;
	
	@ManyToOne
    @JoinColumn(name = "course_id")
    private RDCourse course;

	@Column(name = "session_title")
	private String sessionTitle;

	@Column(name = "creation_date")
	private Date creationDate;
	
	@Column(name = "version")
	private int version;
	
	/*
	 * @OneToMany(mappedBy = "courseSession", cascade = CascadeType.ALL,
	 * orphanRemoval = true) private List<RDSlide> slides;
	 */

	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinColumn(name="course_session_id", nullable = true)
	private List<RDCourseSessionDetail> courseSessionDetails = new ArrayList<RDCourseSessionDetail>();
	
	
	
	public List<RDCourseSessionDetail> getCourseSessionDetails() {
		return courseSessionDetails;
	}

	public void setCourseSessionDetails(List<RDCourseSessionDetail> courseSessionDetails) {
		this.courseSessionDetails = courseSessionDetails;
	}

	public int getCourseSessionId() {
		return courseSessionId;
	}

	public void setCourseSessionId(int courseSessionId) {
		this.courseSessionId = courseSessionId;
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

	public String getSessionTitle() {
		return sessionTitle;
	}

	public void setSessionTitle(String sessionTitle) {
		this.sessionTitle = sessionTitle;
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
	
	

	/*
	 * public List<RDSlide> getSlides() { return slides; }
	 * 
	 * public void setSlides(List<RDSlide> slides) { this.slides = slides; }
	 */

	@Override
	public String toString() {
		return "RDCourseSession [courseSessionId=" + courseSessionId + ", sessionId=" + sessionId + ", course=" + course
				+ ", sessionTitle=" + sessionTitle + ", creationDate=" + creationDate + ", version=" + version + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(course, courseSessionId, creationDate, sessionId, sessionTitle, version);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RDCourseSession other = (RDCourseSession) obj;
		return Objects.equals(course, other.course) && courseSessionId == other.courseSessionId
				&& Objects.equals(creationDate, other.creationDate) && sessionId == other.sessionId
				&& Objects.equals(sessionTitle, other.sessionTitle) && version == other.version;
	}

	
}









