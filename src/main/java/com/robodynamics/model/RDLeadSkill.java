package com.robodynamics.model;

import javax.persistence.*;

//RDLeadSkill.java
@Entity
@Table(name = "rd_lead_skills", uniqueConstraints = @UniqueConstraint(columnNames = { "lead_id", "skill_id" }))
public class RDLeadSkill {

	@EmbeddedId
	private RDLeadSkillId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("leadId")
	@JoinColumn(name = "lead_id", nullable = false)
	private RDLead lead;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("skillId")
	@JoinColumn(name = "skill_id", nullable = false)
	private RDSkill skill;

	public RDLeadSkill() {
	}

	// ✅ Convenience ctor you’re trying to use
	public RDLeadSkill(RDLead lead, RDSkill skill) {
		this.lead = lead;
		this.skill = skill;
		this.id = new RDLeadSkillId(lead.getId(), skill.getSkillId());
	}

	public RDLeadSkillId getId() {
		return id;
	}

	public void setId(RDLeadSkillId id) {
		this.id = id;
	}

	public RDLead getLead() {
		return lead;
	}

	public void setLead(RDLead lead) {
		this.lead = lead;
	}

	public RDSkill getSkill() {
		return skill;
	}

	public void setSkill(RDSkill skill) {
		this.skill = skill;
	}

}
