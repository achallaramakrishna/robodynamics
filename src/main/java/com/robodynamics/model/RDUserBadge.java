package com.robodynamics.model;

import java.sql.Timestamp;

import javax.persistence.*;

@Entity
@Table(name = "rd_user_badges")
public class RDUserBadge {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private RDUser user;

	@ManyToOne
	@JoinColumn(name = "badge_id", nullable = false)
	private RDBadge badge;

	@Column(name = "earned_at", nullable = false)
	private Timestamp earnedAt;

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

	public RDBadge getBadge() {
		return badge;
	}

	public void setBadge(RDBadge badge) {
		this.badge = badge;
	}

	public Timestamp getEarnedAt() {
		return earnedAt;
	}

	public void setEarnedAt(Timestamp earnedAt) {
		this.earnedAt = earnedAt;
	}

	
}
