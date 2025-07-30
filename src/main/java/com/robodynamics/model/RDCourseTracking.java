package com.robodynamics.model;

import java.time.LocalDate;
import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "rd_course_tracking")
public class RDCourseTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tracking_id")
    private int trackingId;

    @ManyToOne
    @JoinColumn(name = "course_session_id", nullable = false)
    private RDCourseSession courseSession;
    
    @ManyToOne
    @JoinColumn(name = "student_enrollment_id", nullable = false)
    private RDStudentEnrollment studentEnrollment;

    // might remove it
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private RDUser user;  // Assuming an RDUser entity representing students

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "file_paths", length = 1000)
    private String filePaths;

    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private RDUser createdBy;  // User who entered the feedback

    // ✅ New field to link to Class Session
    @ManyToOne
    @JoinColumn(name = "class_session_id", nullable = true)
    private RDClassSession classSession;

    
    public RDClassSession getClassSession() {
		return classSession;
	}

	public void setClassSession(RDClassSession classSession) {
		this.classSession = classSession;
	}

	@Column(name = "tracking_date")
    private LocalDate trackingDate;

    public LocalDate getTrackingDate() {
        return trackingDate;
    }

    public void setTrackingDate(LocalDate trackingDate) {
        this.trackingDate = trackingDate;
    }
    
    
    // Default constructor
    public RDCourseTracking() {}

    // Getters and setters
    public int getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(int trackingId) {
        this.trackingId = trackingId;
    }

    
    
    public RDStudentEnrollment getStudentEnrollment() {
		return studentEnrollment;
	}

	public void setStudentEnrollment(RDStudentEnrollment studentEnrollment) {
		this.studentEnrollment = studentEnrollment;
	}

	public RDCourseSession getCourseSession() {
        return courseSession;
    }

    public void setCourseSession(RDCourseSession courseSession) {
        this.courseSession = courseSession;
    }

    public RDUser getUser() {
        return user;
    }

    public void setUser(RDUser user) {
        this.user = user;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

   

    public String getFilePaths() {
		return filePaths;
	}

	public void setFilePaths(String filePaths) {
		this.filePaths = filePaths;
	}

	public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public RDUser getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(RDUser createdBy) {
        this.createdBy = createdBy;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }

    @Override
    public String toString() {
        return "RDCourseTracking{" +
                "trackingId=" + trackingId +
                ", courseSession=" + courseSession +
                ", user=" + user +
                ", feedback='" + feedback + '\'' +
                ", filePaths='" + filePaths + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", createdBy=" + createdBy +
              '}';
    }
}
