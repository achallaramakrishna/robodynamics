package com.robodynamics.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "rd_test")
public class RDTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_id")
    private Integer testId;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "course_session_id", nullable = true)
    private RDCourseSession courseSession;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="course_id", nullable=false)
    private RDCourse course;
    
    @OneToOne(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private RDTestSchedule schedule;

    public RDTestSchedule getSchedule() { return schedule; }
    public void setSchedule(RDTestSchedule schedule) {
        this.schedule = schedule;
        if (schedule != null) schedule.setTest(this);
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "test_type", nullable = false, length = 16)
    private RDTestType testType;

    @Column(name = "test_title", nullable = false, length = 150)
    private String testTitle;

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    @Column(name = "total_marks", nullable = false)
    private Integer totalMarks;
    
 // RDTest.java
    @Column(name = "passing_marks")
    private Integer passingMarks;

    public Integer getPassingMarks() { return passingMarks; }
    public void setPassingMarks(Integer passingMarks) { this.passingMarks = passingMarks; }


    @Lob
    @Column(name = "portions_override")
    private String portionsOverride;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;
    
    @Transient public java.util.Date getTestDateUtil() {
        return testDate != null ? java.sql.Date.valueOf(testDate) : null;
    }
    
    

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /** Updated to RDTestSession */
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RDTestSession> mappings = new HashSet<>();

    // Getters & Setters

    public Integer getTestId() { return testId; }
    public void setTestId(Integer testId) { this.testId = testId; }

    public RDCourseSession getCourseSession() { return courseSession; }
    public void setCourseSession(RDCourseSession courseSession) { this.courseSession = courseSession; }

    public RDCourse getCourse() { return course; }
    public void setCourse(RDCourse course) { this.course = course; }

    public RDTestType getTestType() { return testType; }
    public void setTestType(RDTestType testType) { this.testType = testType; }

    public String getTestTitle() { return testTitle; }
    public void setTestTitle(String testTitle) { this.testTitle = testTitle; }

    public LocalDate getTestDate() { return testDate; }
    public void setTestDate(LocalDate testDate) { this.testDate = testDate; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

    public String getPortionsOverride() { return portionsOverride; }
    public void setPortionsOverride(String portionsOverride) { this.portionsOverride = portionsOverride; }

    public Integer getCreatedBy() { return createdBy; }
    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Boolean getActive() { return isActive; }
    public void setActive(Boolean active) { isActive = active; }

    public Set<RDTestSession> getMappings() { return mappings; }
    public void setMappings(Set<RDTestSession> mappings) { this.mappings = mappings; }
}
