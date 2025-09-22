package com.robodynamics.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;

//RDLeadSkillId.java
@Embeddable
public class RDLeadSkillId implements java.io.Serializable {
 @Column(name = "lead_id")  private Long leadId;
 @Column(name = "skill_id") private Long skillId;

 public RDLeadSkillId() {}
 public RDLeadSkillId(Long leadId, Long skillId) {
     this.leadId = leadId; this.skillId = skillId;
 }
public Long getLeadId() {
	return leadId;
}
public void setLeadId(Long leadId) {
	this.leadId = leadId;
}
public Long getSkillId() {
	return skillId;
}
public void setSkillId(Long skillId) {
	this.skillId = skillId;
}
 
}
