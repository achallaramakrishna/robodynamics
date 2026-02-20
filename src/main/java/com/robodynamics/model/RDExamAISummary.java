package com.robodynamics.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_exam_ai_summary")
public class RDExamAISummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ai_summary_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false, unique = true)
    private RDExamSubmission submission;


    @Column(name = "overall_feedback")
    private String overallFeedback;

    @Column(name = "total_marks", nullable = false)
    private BigDecimal totalMarks;

    @Column(name = "evaluated_by", nullable = false)
    private String evaluatedBy;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public RDExamSubmission getSubmission() {
		return submission;
	}

	public void setSubmission(RDExamSubmission submission) {
		this.submission = submission;
	}

	public String getOverallFeedback() {
		return overallFeedback;
	}

	public void setOverallFeedback(String overallFeedback) {
		this.overallFeedback = overallFeedback;
	}

	public BigDecimal getTotalMarks() {
		return totalMarks;
	}

	public void setTotalMarks(BigDecimal totalMarks) {
		this.totalMarks = totalMarks;
	}

	public String getEvaluatedBy() {
		return evaluatedBy;
	}

	public void setEvaluatedBy(String evaluatedBy) {
		this.evaluatedBy = evaluatedBy;
	}

    /* getters & setters */
}
