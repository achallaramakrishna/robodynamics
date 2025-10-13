package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_parent_needs")
public class RDParentNeed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "need_id")
    private Long id;

    @Column(name = "lead_id", nullable = false)
    private Long leadId;

    @Column(name = "learning_pace")
    private String learningPace;

    @Column(name = "interest_level")
    private String interestLevel;

    @Column(name = "objective")
    private String objective;

    @Column(name = "subject_priority")
    private String subjectPriority;

    @Column(name = "teacher_style")
    private String teacherStyle;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLeadId() { return leadId; }
    public void setLeadId(Long leadId) { this.leadId = leadId; }

    public String getLearningPace() { return learningPace; }
    public void setLearningPace(String learningPace) { this.learningPace = learningPace; }

    public String getInterestLevel() { return interestLevel; }
    public void setInterestLevel(String interestLevel) { this.interestLevel = interestLevel; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getSubjectPriority() { return subjectPriority; }
    public void setSubjectPriority(String subjectPriority) { this.subjectPriority = subjectPriority; }

    public String getTeacherStyle() { return teacherStyle; }
    public void setTeacherStyle(String teacherStyle) { this.teacherStyle = teacherStyle; }
}
