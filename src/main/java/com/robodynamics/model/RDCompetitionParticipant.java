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
@Table(name = "rd_competition_participants")
public class RDCompetitionParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "competition_participants_id")
    private int competition_participant_id;

    @ManyToOne
    @JoinColumn(name = "competition_id")
    private RDCompetition competition;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private RDUser user;

	public int getCompetition_participant_id() {
		return competition_participant_id;
	}

	public void setCompetition_participant_id(int competition_participant_id) {
		this.competition_participant_id = competition_participant_id;
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

    // Getters and Setters
    
    
}
