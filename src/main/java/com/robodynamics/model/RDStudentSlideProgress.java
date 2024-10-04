package com.robodynamics.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "rd_student_slide_progress")
public class RDStudentSlideProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slide_progress_id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private RDStudentEnrollment enrollment;

    @ManyToOne
    @JoinColumn(name = "slide_id", nullable = false)
    private RDSlide slide;

    @Column(name = "is_completed", columnDefinition = "TINYINT(1)")
    private boolean isCompleted;

    @Column(name = "completion_date")
    private Date completionDate;

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

    public RDSlide getSlide() {
        return slide;
    }

    public void setSlide(RDSlide slide) {
        this.slide = slide;
    }

    public boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Date getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(Date completionDate) {
        this.completionDate = completionDate;
    }
}
