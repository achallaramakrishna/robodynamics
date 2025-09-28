package com.robodynamics.model;


import javax.persistence.*;

@Entity
@Table(name = "rd_mentor_skills")
public class RDMentorSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Integer id;                            // surrogate PK of this table

    @Column(name = "mentor_id", nullable = false)
    private Integer mentorId;                      // keep scalar to avoid mapping churn

    @Column(name = "skill_code", nullable = false, length = 40)
    private String skillCode;                      // e.g., "MATH"

    @Column(name = "skill_label", nullable = false, length = 80)
    private String skillLabel;                     // e.g., "Math"

    @Column(name = "skill_level")
    private String skillLevel;                     // "beginner" | "intermediate" | "advanced"

    @Column(name = "grade_min")
    private Integer gradeMin;

    @Column(name = "grade_max")
    private Integer gradeMax;

    @Column(name = "syllabus_board")
    private String syllabusBoard;

    public Integer getGradeMin() { return gradeMin; }
    public void setGradeMin(Integer gradeMin) { this.gradeMin = gradeMin; }

    public Integer getGradeMax() { return gradeMax; }
    public void setGradeMax(Integer gradeMax) { this.gradeMax = gradeMax; }

    public String getSyllabusBoard() { return syllabusBoard; }
    public void setSyllabusBoard(String syllabusBoard) { this.syllabusBoard = syllabusBoard; }

    
    public static enum SyllabusBoard {
        CBSE("CBSE"),
        ICSE("ICSE"),
        STATE("State"),
        IB("IB"),
        IGCSE("IGCSE");

        private final String label;
        SyllabusBoard(String label) { this.label = label; }
        public String getLabel() { return label; }
    }
    
    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getMentorId() {
		return mentorId;
	}

	public void setMentorId(Integer mentorId) {
		this.mentorId = mentorId;
	}

	public String getSkillCode() {
		return skillCode;
	}

	public void setSkillCode(String skillCode) {
		this.skillCode = skillCode;
	}

	public String getSkillLabel() {
		return skillLabel;
	}

	public void setSkillLabel(String skillLabel) {
		this.skillLabel = skillLabel;
	}

	public String getSkillLevel() {
		return skillLevel;
	}

	public void setSkillLevel(String skillLevel) {
		this.skillLevel = skillLevel;
	}

	public java.sql.Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(java.sql.Timestamp createdAt) {
		this.createdAt = createdAt;
	}

    
}
