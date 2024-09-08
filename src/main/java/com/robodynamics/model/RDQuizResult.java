package com.robodynamics.model;

import java.sql.Timestamp;

import javax.persistence.*;

@Entity
@Table(name = "rd_user_quiz_results")
public class RDQuizResult {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "result_id")
	private int id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private RDUser user; // Foreign key to RDUser

	@ManyToOne
	@JoinColumn(name = "quiz_id", nullable = false)
	private RDQuiz quiz; // Foreign key to RDQuiz

	@Column(name = "score")
	private int score;

	@Column(name = "completion_time")
	private int completionTime; // Time taken in seconds to complete the quiz

	@Column(name = "start_time", nullable = false)
	private Timestamp startTime; // When the quiz was started

	@Column(name = "end_time")
	private Timestamp endTime; // When the quiz was completed

	// Getters and Setters
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public RDUser getUser() {
		return user;
	}

	public void setUser(RDUser user) {
		this.user = user;
	}

	public RDQuiz getQuiz() {
		return quiz;
	}

	public void setQuiz(RDQuiz quiz) {
		this.quiz = quiz;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public int getCompletionTime() {
		return completionTime;
	}

	public void setCompletionTime(int completionTime) {
		this.completionTime = completionTime;
	}

	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}
}
