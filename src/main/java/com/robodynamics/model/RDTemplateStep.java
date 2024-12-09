package com.robodynamics.model;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "rd_template_steps")
public class RDTemplateStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "step_id")
    private int stepId;

    @ManyToOne
    @JoinColumn(name = "template_id", foreignKey = @ForeignKey(name = "rd_template_steps_ibfk_1"))
    private RDLearningPathTemplate template;

    @ManyToOne
    @JoinColumn(name = "course_id", foreignKey = @ForeignKey(name = "rd_template_steps_ibfk_2"))
    private RDCourse course;

    @ManyToOne
    @JoinColumn(name = "session_id", foreignKey = @ForeignKey(name = "rd_template_steps_ibfk_3"))
    private RDCourseSession session;

    @Column(name = "step_title", length = 100)
    private String stepTitle;

    @Column(name = "step_description", columnDefinition = "TEXT")
    private String stepDescription;

    @Column(name = "sequence")
    private int sequence;

    @Column(name = "estimated_duration")
    private int estimatedDuration; // Duration in weeks or hours

    @Column(name = "created_date", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdDate;

    // Getters and Setters
    public int getStepId() {
        return stepId;
    }

    public void setStepId(int stepId) {
        this.stepId = stepId;
    }

    public RDLearningPathTemplate getTemplate() {
        return template;
    }

    public void setTemplate(RDLearningPathTemplate template) {
        this.template = template;
    }

    public RDCourse getCourse() {
        return course;
    }

    public void setCourse(RDCourse course) {
        this.course = course;
    }

    public RDCourseSession getSession() {
        return session;
    }

    public void setSession(RDCourseSession session) {
        this.session = session;
    }

    public String getStepTitle() {
        return stepTitle;
    }

    public void setStepTitle(String stepTitle) {
        this.stepTitle = stepTitle;
    }

    public String getStepDescription() {
        return stepDescription;
    }

    public void setStepDescription(String stepDescription) {
        this.stepDescription = stepDescription;
    }

    public int getSequence() {
        return sequence;
    }

    public void setSequence(int sequence) {
        this.sequence = sequence;
    }

    public int getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(int estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public Timestamp getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Timestamp createdDate) {
        this.createdDate = createdDate;
    }
}
