package com.robodynamics.model;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
@Entity
@Table(name = "rd_submissions")
public class RDSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private int submission_id;

    @ManyToOne
    @JoinColumn(name = "competition_id")
    private RDCompetition competition;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private RDUser user;  // Refers to the participant

    @Column(name = "submission_date")
    private Date submissionDate;

    @Column(name = "file_path")
    private String filePath;

	public int getSubmission_id() {
		return submission_id;
	}

	public void setSubmission_id(int submission_id) {
		this.submission_id = submission_id;
	}

	public RDCompetition getCompetition() {
		return competition;
	}

	public void setCompetition(RDCompetition competition) {
		this.competition = competition;
	}

	public RDUser getUser() {
		return user;
	}

	public void setUser(RDUser user) {
		this.user = user;
	}

	public Date getSubmissionDate() {
		return submissionDate;
	}

	public void setSubmissionDate(Date submissionDate) {
		this.submissionDate = submissionDate;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

    // Getters and Setters
    
    
}
