package com.robodynamics.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rd_exam_submission")
public class RDExamSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Integer submissionId;

    @Column(name = "exam_paper_id", nullable = false)
    private Integer examPaperId;
    
    @Column(name = "evaluation_started", nullable = false)
    private boolean evaluationStarted;


    public boolean isEvaluationStarted() {
		return evaluationStarted;
	}

	public void setEvaluationStarted(boolean evaluationStarted) {
		this.evaluationStarted = evaluationStarted;
	}

	public void setExamPaper(RDExamPaper examPaper) {
		this.examPaper = examPaper;
	}

	@Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "attempt_no")
    private Integer attemptNo = 1;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;

    @Column(name = "total_marks", precision = 5, scale = 2)
    private BigDecimal totalMarks;

    @Column(name = "max_marks", precision = 5, scale = 2)
    private BigDecimal maxMarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SubmissionStatus status = SubmissionStatus.DRAFT;

    @Column(name = "evaluator_id")
    private Integer evaluatorId;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "total_marks_awarded")
    private BigDecimal totalMarksAwarded;

    @Column(name = "overall_confidence")
    private Double overallConfidence;

    /* ================= Relationships ================= */

    // 🔥 NEW: Proper link to Exam Paper (READ-ONLY FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "exam_paper_id",
        insertable = false,
        updatable = false
    )
    private RDExamPaper examPaper;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RDExamSubmissionAnswer> answers;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RDExamSubmissionFile> files;

    @ElementCollection
    @CollectionTable(
        name = "rd_exam_submission_files",
        joinColumns = @JoinColumn(name = "submission_id")
    )
    @Column(name = "file_path")
    private List<String> filePaths;

    /* ================= Enums ================= */

    public enum SubmissionStatus {

        DRAFT("Draft"),
        SUBMITTED("Submitted"),
        EVALUATING("Evaluating"),
        AI_EVALUATED("AI Evaluated"),
        REVIEW_REQUIRED("Review Required"),
        FINALIZED("Finalized");

        private final String label;

        SubmissionStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    /* ================= Getters & Setters ================= */

    public Integer getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Integer submissionId) {
        this.submissionId = submissionId;
    }

    public Integer getExamPaperId() {
        return examPaperId;
    }

    public void setExamPaperId(Integer examPaperId) {
        this.examPaperId = examPaperId;
    }

    // 🔥 NEW: Getter used by service & JSP logic
    public RDExamPaper getExamPaper() {
        return examPaper;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getAttemptNo() {
        return attemptNo;
    }

    public void setAttemptNo(Integer attemptNo) {
        this.attemptNo = attemptNo;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(LocalDateTime evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }

    public BigDecimal getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(BigDecimal totalMarks) {
        this.totalMarks = totalMarks;
    }

    public BigDecimal getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(BigDecimal maxMarks) {
        this.maxMarks = maxMarks;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }

    public Integer getEvaluatorId() {
        return evaluatorId;
    }

    public void setEvaluatorId(Integer evaluatorId) {
        this.evaluatorId = evaluatorId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public BigDecimal getTotalMarksAwarded() {
        return totalMarksAwarded;
    }

    public void setTotalMarksAwarded(BigDecimal totalMarksAwarded) {
        this.totalMarksAwarded = totalMarksAwarded;
    }

    public Double getOverallConfidence() {
        return overallConfidence;
    }

    public void setOverallConfidence(Double overallConfidence) {
        this.overallConfidence = overallConfidence;
    }

    public List<RDExamSubmissionAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<RDExamSubmissionAnswer> answers) {
        this.answers = answers;
    }

    public List<RDExamSubmissionFile> getFiles() {
        return files;
    }

    public void setFiles(List<RDExamSubmissionFile> files) {
        this.files = files;
    }

    public List<String> getFilePaths() {
        return filePaths;
    }

    public void setFilePaths(List<String> filePaths) {
        this.filePaths = filePaths;
    }
}
