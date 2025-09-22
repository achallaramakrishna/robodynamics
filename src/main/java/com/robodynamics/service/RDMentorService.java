// src/main/java/com/robodynamics/service/RDMentorService.java
package com.robodynamics.service;


import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDSkill;

import java.util.List;

public interface RDMentorService {
    List<RDMentorDTO> getAllMentors();          // basic list
    List<RDMentorDTO> getMentorsWithSummary();  // includes offeringsCount
	List<RDMentorDTO> getFeaturedMentors();
	
	// -------- WRITES (mentor onboarding) --------
    /**
     * Create/update rd_users (mentor profile), rd_mentors, and rd_mentor_skills
     * based on a mentor lead. Returns the generated/existing mentor_id.
     */
    Integer upsertMentorFromLead(RDLead lead, List<RDSkill> rdSkills);

    /**
     * Insert missing (mentor_id, skill_label) rows into rd_mentor_skills,
     * using labels from canonical RDSkill rows. Idempotent.
     */
    void upsertMentorSkills(Integer mentorId, List<RDSkill> rdSkills);

}
