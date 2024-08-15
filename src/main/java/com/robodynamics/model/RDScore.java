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
@Table(name = "rd_scores")
public class RDScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "score_id")
    private int score_id;

    @ManyToOne
    @JoinColumn(name = "submission_id")
    private RDSubmission submission;

    @ManyToOne
    @JoinColumn(name = "judge_user_id")
    private RDUser judgeUser;  // Refers to the judge

    @Column(name = "score")
    private int score;

    @Column(name = "comments")
    private String comments;

	public int getScore_id() {
		return score_id;
	}

	public void setScore_id(int score_id) {
		this.score_id = score_id;
	}

	public RDSubmission getSubmission() {
		return submission;
	}

	public void setSubmission(RDSubmission submission) {
		this.submission = submission;
	}

	public RDUser getJudgeUser() {
		return judgeUser;
	}

	public void setJudgeUser(RDUser judgeUser) {
		this.judgeUser = judgeUser;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

    // Getters and Setters

    
}
