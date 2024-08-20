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
@Table(name = "rd_competition_judges")
public class RDCompetitionJudge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "competition_judege_id")
    private int competition_judege_id;

    @ManyToOne
    @JoinColumn(name = "competition_id")
    private RDCompetition competition;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private RDUser user;

	

	
	public int getCompetition_judege_id() {
		return competition_judege_id;
	}

	public void setCompetition_judege_id(int competition_judege_id) {
		this.competition_judege_id = competition_judege_id;
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