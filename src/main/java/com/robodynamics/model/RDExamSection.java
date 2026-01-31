package com.robodynamics.model;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "rd_exam_sections")
public class RDExamSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Integer sectionId;

    /* ================= RELATION ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_paper_id", nullable = false)
    private RDExamPaper examPaper;

    /* ================= BASIC ================= */

    @Column(name = "section_name")
    private String sectionName; // A, B, PHY-A, CHEM-B

    @Column(name = "title")
    private String title; // Physics – Section A

    @Column(name = "description")
    private String description;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    /* ================= ATTEMPT RULES ================= */

    @Enumerated(EnumType.STRING)
    @Column(name = "attempt_type", nullable = false)
    private AttemptType attemptType; // ALL / ANY_N

    @Column(name = "attempt_count")
    private Integer attemptCount; // Required when ANY_N

    @Column(name = "compulsory")
    private Boolean compulsory = true;

    @Column(name = "min_questions")
    private Integer minQuestions;

    @Column(name = "max_questions")
    private Integer maxQuestions;

    /* ================= MARKING & DISPLAY ================= */

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "shuffle_questions")
    private Boolean shuffleQuestions = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "display_style")
    private DisplayStyle displayStyle = DisplayStyle.LIST;

    @Column(name = "section_order")
    private Integer sectionOrder;
    
    

    /* ================= QUESTIONS ================= */

    @OneToMany(
    	    mappedBy = "section",
    	    cascade = CascadeType.ALL,
    	    orphanRemoval = true
    	)
    	@OrderBy("displayOrder ASC")
    	private Set<RDExamSectionQuestion> questions = new LinkedHashSet<>();


    /* ================= ENUMS ================= */

    public enum AttemptType {
        ALL,       // NEET Section A
        ANY_N      // NEET Section B
    }

    public enum DisplayStyle {
        LIST,        // Normal
        GROUP,       // Grouped questions
        CASE_STUDY   // Passage-based
    }

    /* ================= GETTERS & SETTERS ================= */

    public Integer getSectionId() {
        return sectionId;
    }

    public void setSectionId(Integer sectionId) {
        this.sectionId = sectionId;
    }

    public RDExamPaper getExamPaper() {
        return examPaper;
    }

    public void setExamPaper(RDExamPaper examPaper) {
        this.examPaper = examPaper;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public AttemptType getAttemptType() {
        return attemptType;
    }

    public void setAttemptType(AttemptType attemptType) {
        this.attemptType = attemptType;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public Boolean getCompulsory() {
        return compulsory;
    }

    public void setCompulsory(Boolean compulsory) {
        this.compulsory = compulsory;
    }

    public Integer getMinQuestions() {
        return minQuestions;
    }

    public void setMinQuestions(Integer minQuestions) {
        this.minQuestions = minQuestions;
    }

    public Integer getMaxQuestions() {
        return maxQuestions;
    }

    public void setMaxQuestions(Integer maxQuestions) {
        this.maxQuestions = maxQuestions;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Boolean getShuffleQuestions() {
        return shuffleQuestions;
    }

    public void setShuffleQuestions(Boolean shuffleQuestions) {
        this.shuffleQuestions = shuffleQuestions;
    }

    public DisplayStyle getDisplayStyle() {
        return displayStyle;
    }

    public void setDisplayStyle(DisplayStyle displayStyle) {
        this.displayStyle = displayStyle;
    }

    public Integer getSectionOrder() {
        return sectionOrder;
    }

    public void setSectionOrder(Integer sectionOrder) {
        this.sectionOrder = sectionOrder;
    }

	public Set<RDExamSectionQuestion> getQuestions() {
		return questions;
	}

	public void setQuestions(Set<RDExamSectionQuestion> sectionQuestions) {
		this.questions = sectionQuestions;
	}

    
}
