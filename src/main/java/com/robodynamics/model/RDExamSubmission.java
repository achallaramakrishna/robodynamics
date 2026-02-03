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

    /* ================= Relationships ================= */

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

	public enum SubmissionStatus {
		DRAFT,
	    SUBMITTED,
	    EVALUATING,
	    AI_EVALUATED,
	    REVIEW_REQUIRED,
	    FINALIZED
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
}
