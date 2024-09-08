package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_quests")
public class RDQuest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "quest_id")
	private int id;

	@Column(name = "quest_name", nullable = false)
	private String name;

	@Column(name = "quest_description")
	private String description;

	@Column(name = "points_reward", nullable = false)
	private int pointsReward; // Points rewarded for completing the quest

	// Getters and Setters
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getPointsReward() {
		return pointsReward;
	}

	public void setPointsReward(int pointsReward) {
		this.pointsReward = pointsReward;
	}
}
