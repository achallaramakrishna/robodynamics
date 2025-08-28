package com.robodynamics.model;


import javax.persistence.*;

@Entity
@Table(name = "rd_mentor_skills")
public class RDMentorSkill {

  public enum SyllabusBoard { CBSE, ICSE, STATE, IB, IGCSE, OTHER }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "mentor_skill_id")
  private Integer mentorSkillId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "mentor_id", nullable = false)
  private RDMentor mentor;

  @Column(name = "subject_code", nullable = false, length = 50)
  private String subjectCode;

  @Column(name = "grade_min", nullable = false)
  private Integer gradeMin;

  @Column(name = "grade_max", nullable = false)
  private Integer gradeMax;

  @Enumerated(EnumType.STRING)
  @Column(name = "syllabus_board", nullable = false, length = 16)
  private SyllabusBoard syllabusBoard = SyllabusBoard.CBSE;

  // --- getters/setters ---
  public Integer getMentorSkillId() { return mentorSkillId; }
  public void setMentorSkillId(Integer mentorSkillId) { this.mentorSkillId = mentorSkillId; }
  public RDMentor getMentor() { return mentor; }
  public void setMentor(RDMentor mentor) { this.mentor = mentor; }
  public String getSubjectCode() { return subjectCode; }
  public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
  public Integer getGradeMin() { return gradeMin; }
  public void setGradeMin(Integer gradeMin) { this.gradeMin = gradeMin; }
  public Integer getGradeMax() { return gradeMax; }
  public void setGradeMax(Integer gradeMax) { this.gradeMax = gradeMax; }
  public SyllabusBoard getSyllabusBoard() { return syllabusBoard; }
  public void setSyllabusBoard(SyllabusBoard syllabusBoard) { this.syllabusBoard = syllabusBoard; }
}
