package com.robodynamics.model;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import java.io.Serializable;
import java.util.Objects;


@Entity
@Table(name = "rd_mentor_assignments", uniqueConstraints = @UniqueConstraint(name = "uq_lead_mentor_skill", columnNames = {
		"lead_id", "mentor_id", "skill_id" }))
public class RDMentorAssignment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	public enum Status {
		PENDING, CLAIMED, SCHEDULED, COMPLETED, REJECTED
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "lead_id", nullable = false)
	private RDLead lead;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "mentor_id", nullable = false)
	private RDUser mentor;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "skill_id", nullable = false)
	private RDSkill skill;

	@Column(name = "is_demo_mentor", nullable = false)
	private boolean demoMentor = false;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private Status status = Status.PENDING;

	@Column(name = "proposed_demo_date")
	private LocalDateTime proposedDemoDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public RDLead getLead() {
		return lead;
	}

	public void setLead(RDLead lead) {
		this.lead = lead;
	}

	public RDUser getMentor() {
		return mentor;
	}

	public void setMentor(RDUser mentor) {
		this.mentor = mentor;
	}

	public RDSkill getSkill() {
		return skill;
	}

	public void setSkill(RDSkill skill) {
		this.skill = skill;
	}

	public boolean isDemoMentor() {
		return demoMentor;
	}

	public void setDemoMentor(boolean demoMentor) {
		this.demoMentor = demoMentor;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public LocalDateTime getProposedDemoDate() {
		return proposedDemoDate;
	}

	public void setProposedDemoDate(LocalDateTime proposedDemoDate) {
		this.proposedDemoDate = proposedDemoDate;
	}

}
