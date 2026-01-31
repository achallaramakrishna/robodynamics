package com.robodynamics.model;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "rd_exam_papers")
public class RDExamPaper {

    /* ================= PRIMARY KEY ================= */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_paper_id")
    private Integer examPaperId;

    /* ================= BASIC INFO ================= */

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "subject")
    private String subject;

    @Column(name = "board")
    private String board;

    @Column(name = "exam_year")
    private Integer examYear;

    @Column(name = "exam_type")
    private String examType;

    @Column(name = "pattern_code")
    private String patternCode;

    @Column(name = "version")
    private Integer version = 1;

    /* ================= TIMING & MARKING ================= */

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "total_marks", nullable = false)
    private Integer totalMarks;

    @Column(name = "negative_marking")
    private Boolean negativeMarking = false;

    @Column(name = "negative_mark_value")
    private Double negativeMarkValue = 0.0;

    /* ================= CBT ================= */

    @Column(name = "shuffle_sections")
    private Boolean shuffleSections = false;

    @Column(name = "shuffle_questions")
    private Boolean shuffleQuestions = false;

    /* ================= META ================= */

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ExamStatus status = ExamStatus.DRAFT;

    @Column(name = "is_active")
    private Integer isActive = 1;

    /**
     * DB-controlled timestamp
     * DEFAULT CURRENT_TIMESTAMP
     */
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    /* ================= RELATIONSHIPS ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_session_detail_id", nullable = false)
    private RDCourseSessionDetail courseSessionDetail;
    
    @OneToMany(
    	    mappedBy = "examPaper",
    	    cascade = CascadeType.ALL,
    	    orphanRemoval = true
    	)
    	@OrderBy("sectionOrder ASC")
    	private Set<RDExamSection> sections = new LinkedHashSet<>();

    	public Set<RDExamSection> getSections() { return sections; }
    	public void setSections(Set<RDExamSection> sections) { this.sections = sections; }

    


    /* ================= ENUM ================= */

    
	public enum ExamStatus {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }

    /* ================= GETTERS & SETTERS ================= */

    public Integer getExamPaperId() { return examPaperId; }
    public void setExamPaperId(Integer examPaperId) { this.examPaperId = examPaperId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBoard() { return board; }
    public void setBoard(String board) { this.board = board; }

    public Integer getExamYear() { return examYear; }
    public void setExamYear(Integer examYear) { this.examYear = examYear; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getPatternCode() { return patternCode; }
    public void setPatternCode(String patternCode) { this.patternCode = patternCode; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

    public Boolean getNegativeMarking() { return negativeMarking; }
    public void setNegativeMarking(Boolean negativeMarking) { this.negativeMarking = negativeMarking; }

    public Double getNegativeMarkValue() { return negativeMarkValue; }
    public void setNegativeMarkValue(Double negativeMarkValue) { this.negativeMarkValue = negativeMarkValue; }

    public Boolean getShuffleSections() { return shuffleSections; }
    public void setShuffleSections(Boolean shuffleSections) { this.shuffleSections = shuffleSections; }

    public Boolean getShuffleQuestions() { return shuffleQuestions; }
    public void setShuffleQuestions(Boolean shuffleQuestions) { this.shuffleQuestions = shuffleQuestions; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public ExamStatus getStatus() { return status; }
    public void setStatus(ExamStatus status) { this.status = status; }

    public Integer getIsActive() { return isActive; }
    public void setIsActive(Integer isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public RDCourseSessionDetail getCourseSessionDetail() { return courseSessionDetail; }
    public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
        this.courseSessionDetail = courseSessionDetail;
    }
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
}
