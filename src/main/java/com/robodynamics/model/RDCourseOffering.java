package com.robodynamics.model;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

@Entity
@Table(name = "rd_course_offerings")
@JsonRootName("event")
@JsonIgnoreProperties({"course", "studentEnrollments", "classSessions", "hibernateLazyInitializer", "handler"})
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
    
    @Column(name = "fee_amount")
    private Double feeAmount;


    @Column(name = "is_active", nullable = false)
    @JsonIgnore
    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private RDCourse course;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    @JsonIgnore
    private RDUser instructor;

    
    @Column(name = "sessions_per_week")
    private Integer sessionsPerWeek;

    @Column(name = "days_of_week")
    private String daysOfWeek; // Stored as comma-separated: "Mon,Wed,Fri"

    @Column(name = "session_start_time")
    private LocalTime sessionStartTime;

    @Column(name = "session_end_time")
    private LocalTime sessionEndTime;
    
    @OneToMany(mappedBy = "courseOffering", fetch = FetchType.LAZY)
    private Set<RDStudentEnrollment> studentEnrollments;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id") // new column in rd_course_offerings
    private RDMentor mentor;

    // getters/setters
    public RDMentor getMentor() { return mentor; }
    public void setMentor(RDMentor mentor) { this.mentor = mentor; }

    
    public Set<RDStudentEnrollment> getStudentEnrollments() {
		return studentEnrollments;
	}

	public void setStudentEnrollments(Set<RDStudentEnrollment> studentEnrollments) {
		this.studentEnrollments = studentEnrollments;
	}

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

   

    public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
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

    
	public Integer getSessionsPerWeek() {
		return sessionsPerWeek;
	}

	public void setSessionsPerWeek(Integer sessionsPerWeek) {
		this.sessionsPerWeek = sessionsPerWeek;
	}

	public String getDaysOfWeek() {
		return daysOfWeek;
	}

	public void setDaysOfWeek(String daysOfWeek) {
		this.daysOfWeek = daysOfWeek;
	}

	public LocalTime getSessionStartTime() {
		return sessionStartTime;
	}

	public void setSessionStartTime(LocalTime sessionStartTime) {
		this.sessionStartTime = sessionStartTime;
	}

	public LocalTime getSessionEndTime() {
		return sessionEndTime;
	}

	public void setSessionEndTime(LocalTime sessionEndTime) {
		this.sessionEndTime = sessionEndTime;
	}
	
	

	public Double getFeeAmount() {
		return feeAmount;
	}
	public void setFeeAmount(Double feeAmount) {
		this.feeAmount = feeAmount;
	}
	@Override
	public String toString() {
		return "RDCourseOffering [courseOfferingId=" + courseOfferingId + ", startDate=" + startDate + ", endDate="
				+ endDate + ", courseOfferingName=" + courseOfferingName + ", feeAmount=" + feeAmount + ", isActive="
				+ isActive + ", course=" + course + ", instructor=" + instructor + ", sessionsPerWeek="
				+ sessionsPerWeek + ", daysOfWeek=" + daysOfWeek + ", sessionStartTime=" + sessionStartTime
				+ ", sessionEndTime=" + sessionEndTime +  "]";
	}
	
	


	

	
    

    
}
