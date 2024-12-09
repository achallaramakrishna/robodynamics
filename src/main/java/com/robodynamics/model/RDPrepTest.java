package com.robodynamics.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

@Entity
@Table(name = "rd_exam_prep_tests")
public class RDPrepTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "learning_path_id")
    private int learningPathId;

    @Column(name = "test_date")
    private Date testDate;

    @Column(name = "status")
    private String status;
    
    @Column(name = "goal_id", nullable = false)
    private int goalId;

 // Many-to-One relationship with RDGoal (optional for easier navigation)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", insertable = false, updatable = false)
    private RDGoal goal;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getLearningPathId() {
		return learningPathId;
	}

	public void setLearningPathId(int learningPathId) {
		this.learningPathId = learningPathId;
	}

	public Date getTestDate() {
		return testDate;
	}

	public void setTestDate(Date testDate) {
		this.testDate = testDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getGoalId() {
		return goalId;
	}

	public void setGoalId(int goalId) {
		this.goalId = goalId;
	}

	public RDGoal getGoal() {
		return goal;
	}

	public void setGoal(RDGoal goal) {
		this.goal = goal;
	}

    // Getters and Setters
	
	
    
    
}
