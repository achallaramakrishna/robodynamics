package com.robodynamics.model;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "rd_class_sessions")
public class RDClassSession {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "class_session_id")
	private int classSessionId;
	
	@Column(name = "session_date")
	private Date sessionDate;
	
	@Column(name = "session_title")
	private String sessionTitle;
	
	@Column(name = "session_description")
	private String sessionDescription;
	
	public List<RDCourseTracking> getCourseTrackings() {
		return courseTrackings;
	}


	public void setCourseTrackings(List<RDCourseTracking> courseTrackings) {
		this.courseTrackings = courseTrackings;
	}


	@ManyToOne
    @JoinColumn(name = "course_offering_id")
    private RDCourseOffering courseOffering;


	 // ✅ New: Link with course tracking
    @OneToMany(mappedBy = "classSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RDCourseTracking> courseTrackings;	

    
	public RDClassSession() {
		
	}


	public int getClassSessionId() {
		return classSessionId;
	}


	public void setClassSessionId(int classSessionId) {
		this.classSessionId = classSessionId;
	}


	public Date getSessionDate() {
		return sessionDate;
	}


	public void setSessionDate(Date sessionDate) {
		this.sessionDate = sessionDate;
	}


	public String getSessionTitle() {
		return sessionTitle;
	}


	public void setSessionTitle(String sessionTitle) {
		this.sessionTitle = sessionTitle;
	}


	public String getSessionDescription() {
		return sessionDescription;
	}


	public void setSessionDescription(String sessionDescription) {
		this.sessionDescription = sessionDescription;
	}


	public RDCourseOffering getCourseOffering() {
		return courseOffering;
	}


	public void setCourseOffering(RDCourseOffering courseOffering) {
		this.courseOffering = courseOffering;
	}


	@Override
	public String toString() {
		return "RDClassSession [classSessionId=" + classSessionId + ", sessionDate=" + sessionDate + ", sessionTitle="
				+ sessionTitle + ", sessionDescription=" + sessionDescription + ", courseOffering=" + courseOffering
				+ "]";
	}

	


}
