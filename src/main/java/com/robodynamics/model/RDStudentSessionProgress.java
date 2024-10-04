package com.robodynamics.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "rd_student_session_progress")
public class RDStudentSessionProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_progress_id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private RDStudentEnrollment enrollment;

    @ManyToOne
    @JoinColumn(name = "course_session_id", nullable = false)
    private RDCourseSession courseSession;

    @Column(name = "progress")
    private double progress;

    // Getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RDStudentEnrollment getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(RDStudentEnrollment enrollment) {
        this.enrollment = enrollment;
    }

    public RDCourseSession getCourseSession() {
        return courseSession;
    }

    public void setCourseSession(RDCourseSession courseSession) {
        this.courseSession = courseSession;
    }

    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
    }
}
