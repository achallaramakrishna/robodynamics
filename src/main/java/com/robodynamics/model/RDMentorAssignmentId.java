package com.robodynamics.model;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.*;

@Embeddable
public class RDMentorAssignmentId implements Serializable {
	@Column(name = "lead_id")
	private Long leadId;
	@Column(name = "mentor_id")
	private Integer mentorId;
	@Column(name = "skill_id")
	private Integer skillId;
	
	

	public Long getLeadId() {
		return leadId;
	}

	public void setLeadId(Long leadId) {
		this.leadId = leadId;
	}

	public Integer getMentorId() {
		return mentorId;
	}

	public void setMentorId(Integer mentorId) {
		this.mentorId = mentorId;
	}

	public Integer getSkillId() {
		return skillId;
	}

	public void setSkillId(Integer skillId) {
		this.skillId = skillId;
	}

	@Override
	public int hashCode() {
		return Objects.hash(leadId, mentorId, skillId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RDMentorAssignmentId other = (RDMentorAssignmentId) obj;
		return Objects.equals(leadId, other.leadId) && Objects.equals(mentorId, other.mentorId)
				&& Objects.equals(skillId, other.skillId);
	}

	

}
