package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_exam_section_questions")
public class RDExamSectionQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /* ================= RELATIONSHIPS ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private RDExamSection section;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private RDQuizQuestion question;

    /* ================= STRUCTURE ================= */

    @Column(name = "parent_question_id")
    private Integer parentQuestionId; 
    // Used for case study / passage-based grouping

    @Column(name = "sub_label")
    private String subLabel; 
    // a, b, c (ICSE-style sub questions)

    @Column(name = "display_order")
    private Integer displayOrder;

    /* ================= MARKING ================= */

    @Column(name = "marks", nullable = false)
    private Integer marks;

    @Column(name = "negative_marks")
    private Double negativeMarks = 0.0;

    /* ================= RULES ================= */

    @Column(name = "mandatory")
    private Boolean mandatory = false;

    @Column(name = "internal_choice_group")
    private Integer internalChoiceGroup;
    // Same value → OR questions (Q5 OR Q6)

    @Column(name = "max_word_limit")
    private Integer maxWordLimit;
    // For descriptive answers

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_override")
    private DifficultyOverride difficultyOverride;

    /* ================= ENUM ================= */

    public enum DifficultyOverride {
        EASY,
        MEDIUM,
        HARD
    }

    /* ================= GETTERS & SETTERS ================= */

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public RDExamSection getSection() {
        return section;
    }

    public void setSection(RDExamSection section) {
        this.section = section;
    }

    public RDQuizQuestion getQuestion() {
        return question;
    }

    public void setQuestion(RDQuizQuestion question) {
        this.question = question;
    }

    public Integer getParentQuestionId() {
        return parentQuestionId;
    }

    public void setParentQuestionId(Integer parentQuestionId) {
        this.parentQuestionId = parentQuestionId;
    }

    public String getSubLabel() {
        return subLabel;
    }

    public void setSubLabel(String subLabel) {
        this.subLabel = subLabel;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public Double getNegativeMarks() {
        return negativeMarks;
    }

    public void setNegativeMarks(Double negativeMarks) {
        this.negativeMarks = negativeMarks;
    }

    public Boolean getMandatory() {
        return mandatory;
    }

    public void setMandatory(Boolean mandatory) {
        this.mandatory = mandatory;
    }

    public Integer getInternalChoiceGroup() {
        return internalChoiceGroup;
    }

    public void setInternalChoiceGroup(Integer internalChoiceGroup) {
        this.internalChoiceGroup = internalChoiceGroup;
    }

    public Integer getMaxWordLimit() {
        return maxWordLimit;
    }

    public void setMaxWordLimit(Integer maxWordLimit) {
        this.maxWordLimit = maxWordLimit;
    }

    public DifficultyOverride getDifficultyOverride() {
        return difficultyOverride;
    }

    public void setDifficultyOverride(DifficultyOverride difficultyOverride) {
        this.difficultyOverride = difficultyOverride;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
