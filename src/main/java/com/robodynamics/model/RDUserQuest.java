package com.robodynamics.model;

import java.sql.Timestamp;

import javax.persistence.*;

@Entity
@Table(name = "rd_user_quests")
public class RDUserQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_quest_id")  // Primary key column
    private int userQuestId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)  // Foreign key to RDUser
    private RDUser user;

    @ManyToOne
    @JoinColumn(name = "quest_id", nullable = false)  // Foreign key to RDQuest
    private RDQuest quest;

    @Column(name = "completed_at", nullable = false)  // Timestamp for when the quest was completed
    private Timestamp completedAt;

	public int getUserQuestId() {
		return userQuestId;
	}

	public void setUserQuestId(int userQuestId) {
		this.userQuestId = userQuestId;
	}

	public RDUser getUser() {
		return user;
	}

	public void setUser(RDUser user) {
		this.user = user;
	}

	public RDQuest getQuest() {
		return quest;
	}

	public void setQuest(RDQuest quest) {
		this.quest = quest;
	}

	public Timestamp getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(Timestamp completedAt) {
		this.completedAt = completedAt;
	}

    
}
