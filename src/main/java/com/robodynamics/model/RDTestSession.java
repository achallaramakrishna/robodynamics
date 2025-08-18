// com.robodynamics.model.RDTestSession
package com.robodynamics.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "rd_test_session")
public class RDTestSession {

    @EmbeddedId
    private RDTestSessionId id = new RDTestSessionId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("testId")
    @JoinColumn(name = "test_id", nullable = false)
    private RDTest test;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("courseSessionId")
    @JoinColumn(name = "course_session_id", nullable = false)
    private RDCourseSession courseSession;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 16)
    private RDTestDetailRole role = RDTestDetailRole.PORTION;

    @Lob
    @Column(name = "notes")
    private String notes;

    @Column(name = "uploaded_by")
    private Integer uploadedBy;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", length = 16, nullable = false)
    private RDVisibility visibility = RDVisibility.PARENT;

    // Getters & setters
    public RDTestSessionId getId() { return id; }
    public void setId(RDTestSessionId id) { this.id = id; }

    public RDTest getTest() { return test; }
    public void setTest(RDTest test) {
        this.test = test;
        if (test != null) this.id.setTestId(test.getTestId());
    }

    public RDCourseSession getCourseSession() { return courseSession; }
    public void setCourseSession(RDCourseSession courseSession) {
        this.courseSession = courseSession;
        if (courseSession != null) this.id.setCourseSessionId(courseSession.getCourseSessionId());
    }

    public RDTestDetailRole getRole() { return role; }
    public void setRole(RDTestDetailRole role) { this.role = role; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(Integer uploadedBy) { this.uploadedBy = uploadedBy; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }

    public RDVisibility getVisibility() { return visibility; }
    public void setVisibility(RDVisibility visibility) { this.visibility = visibility; }
}
