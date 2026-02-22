package com.robodynamics.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_lab_progress")
public class RDLabProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lab_progress_id")
    private Integer labProgressId;

    private Integer labManualId;
    private Integer studentId;

    private Integer completionPercent;
    private String status;

    private LocalDateTime submittedAt;
    private Integer reviewedBy;

    private BigDecimal score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

	public Integer getLabProgressId() {
		return labProgressId;
	}

	public void setLabProgressId(Integer labProgressId) {
		this.labProgressId = labProgressId;
	}

	public Integer getLabManualId() {
		return labManualId;
	}

	public void setLabManualId(Integer labManualId) {
		this.labManualId = labManualId;
	}

	public Integer getStudentId() {
		return studentId;
	}

	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}

	public Integer getCompletionPercent() {
		return completionPercent;
	}

	public void setCompletionPercent(Integer completionPercent) {
		this.completionPercent = completionPercent;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}

	public Integer getReviewedBy() {
		return reviewedBy;
	}

	public void setReviewedBy(Integer reviewedBy) {
		this.reviewedBy = reviewedBy;
	}

	public BigDecimal getScore() {
		return score;
	}

	public void setScore(BigDecimal score) {
		this.score = score;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}

    
}
