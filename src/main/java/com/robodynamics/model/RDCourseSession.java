package com.robodynamics.model;


import java.beans.Transient;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Table(name = "rd_course_sessions")
public class RDCourseSession {
	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_session_id")
	private Integer courseSessionId;

	@Column(name = "session_id")
	private Integer sessionId;
	
	@ManyToOne
    @JoinColumn(name = "course_id")
	@JsonIgnore  // Prevent circular reference during serialization
    private RDCourse course;

	@ManyToOne
	@JoinColumn(name = "parent_session_id")
	@JsonBackReference // Handles JSON serialization
	private RDCourseSession parentSession;
	
	@Column(name = "session_type")
	private String sessionType; // Possible values: 'unit' or 'session'

	public String getSessionType() {
	    return sessionType;
	}

	public void setSessionType(String sessionType) {
	    this.sessionType = sessionType;
	}
	
	@OneToMany(mappedBy = "parentSession", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JsonIgnore
 // Handles JSON serialization
	private Set<RDCourseSession> childSessions = new HashSet<>();

	@Column(name = "tier_level")
    @Enumerated(EnumType.STRING)
    private TierLevel tierLevel;

    @Column(name = "tier_order")
    private int tierOrder;

    // Define the TierLevel enum within RDCourseSession
    public enum TierLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }

    // Getters and Setters
    public TierLevel getTierLevel() {
        return tierLevel;
    }

    public void setTierLevel(TierLevel tierLevel) {
        this.tierLevel = tierLevel;
    }

    public int getTierOrder() {
        return tierOrder;
    }

    public void setTierOrder(int tierOrder) {
        this.tierOrder = tierOrder;
    }

    
	public Set<RDCourseSession> getChildSessions() {
	    return childSessions;
	}

	public void setChildSessions(Set<RDCourseSession> childSessions) {
	    this.childSessions = childSessions;
	}
	
	@Column(name = "session_title")
	private String sessionTitle;

	@Column(name = "creation_date")
	private Date creationDate;
	
	@Column(name = "version")
	private int version;
	
	@Column(name = "progress")
	private Double progress;

	@Column(name = "grade")
	private String grade;

	@Column(name = "session_description")
	private String sessionDescription;

	
	

	
	public String getSessionDescription() {
		return sessionDescription;
	}

	public void setSessionDescription(String sessionDescription) {
		this.sessionDescription = sessionDescription;
	}

	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinColumn(name="course_session_id", nullable = true)
	@JsonIgnore
	private Set<RDCourseSessionDetail> courseSessionDetails = new TreeSet<RDCourseSessionDetail>();
	
	public Set<RDCourseSessionDetail> getCourseSessionDetails() {
		return courseSessionDetails;
	}

	public void setCourseSessionDetails(Set<RDCourseSessionDetail> courseSessionDetails) {
		this.courseSessionDetails = courseSessionDetails;
	}

	public Integer getCourseSessionId() {
		return courseSessionId;
	}

	public void setCourseSessionId(Integer courseSessionId) {
		this.courseSessionId = courseSessionId;
	}

	public Integer getSessionId() {
		return sessionId;
	}

	public void setSessionId(Integer sessionId) {
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

	
	public RDCourseSession getParentSession() {
		return parentSession;
	}

	public void setParentSession(RDCourseSession parentSession) {
		this.parentSession = parentSession;
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
	
	
	


	public Double getProgress() {
		return progress;
	}

	public void setProgress(Double progress) {
		this.progress = progress;
	}
	
	

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@Override
	public String toString() {
		return "RDCourseSession [courseSessionId=" + courseSessionId + ", sessionId=" + sessionId + ", course=" + course
				+ ", sessionTitle=" + sessionTitle + ", creationDate=" + creationDate + ", version=" + version
				+ ", progress=" + progress + "]";
	}



	

}









