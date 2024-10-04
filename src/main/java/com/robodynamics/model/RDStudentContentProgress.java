package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_student_content_progress")
public class RDStudentContentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_progress_id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "session_progress_id", nullable = false)
    private RDStudentSessionProgress sessionProgress;

    @ManyToOne
    @JoinColumn(name = "course_session_detail_id", nullable = false)
    private RDCourseSessionDetail courseSessionDetail;

    @Column(name = "content_type")
    private String contentType;  // e.g., 'slide', 'quiz', 'flashcard'

    @Column(name = "progress")
    private double progress;

    // Getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RDStudentSessionProgress getSessionProgress() {
        return sessionProgress;
    }

    public void setSessionProgress(RDStudentSessionProgress sessionProgress) {
        this.sessionProgress = sessionProgress;
    }

    public RDCourseSessionDetail getCourseSessionDetail() {
        return courseSessionDetail;
    }

    public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
        this.courseSessionDetail = courseSessionDetail;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
    }
}
