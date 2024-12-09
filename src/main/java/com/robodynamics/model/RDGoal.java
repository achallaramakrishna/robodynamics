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
@Table(name = "rd_exam_prep_goals")
public class RDGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "learning_path_id")
    private int learningPathId;

    @Column(name = "goal_description")
    private String goalDescription;

    @Column(name = "status")
    private String status;

    @Column(name = "due_date")
    private Date dueDate;

 // Many-to-One relationship with Learning Path
    @ManyToOne
    @JoinColumn(name = "learning_path_id", insertable = false, updatable = false)
    private RDLearningPath learningPath;
    
    public RDLearningPath getLearningPath() {
		return learningPath;
	}

	public void setLearningPath(RDLearningPath learningPath) {
		this.learningPath = learningPath;
	}

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

	public String getGoalDescription() {
		return goalDescription;
	}

	public void setGoalDescription(String goalDescription) {
		this.goalDescription = goalDescription;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

    // Getters and Setters
    
    
}
