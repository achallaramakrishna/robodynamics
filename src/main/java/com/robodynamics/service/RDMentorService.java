// src/main/java/com/robodynamics/service/RDMentorService.java
package com.robodynamics.service;

import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.dto.RDMentorSearchCriteria;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentor;
import com.robodynamics.model.RDSkill;

import java.util.List;

public interface RDMentorService {

    // -----------------------------------------
    // MENTOR PROFILE / BASIC QUERIES
    // -----------------------------------------
    boolean isMentorProfileComplete(int userId);

    List<RDMentorDTO> getAllMentors();          // basic list
    List<RDMentorDTO> getMentorsWithSummary();  // includes offeringsCount
    List<RDMentorDTO> getFeaturedMentors();


    boolean hasMentorProfile(int userID);


    // -----------------------------------------
    // MENTOR ONBOARDING FLOW
    // -----------------------------------------

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

    /**
     * Match mentors from lead information using flexible criteria.
     */
    List<RDMentor> findMentorsForLead(RDLead lead);


    // -----------------------------------------
    // ADVANCED SEARCH (UPDATED)
    // -----------------------------------------

    /**
     * Search mentors using advanced multi-filter criteria:
     * - skill
     * - grade
     * - board
     * - city
     * - gender
     * - teaching mode (Online / Offline / Hybrid)
     * - verifiedOnly
     * - free-text enquiry parsing
     * - paging + sorting
     */
    List<RDMentor> searchMentors(
            RDMentorSearchCriteria criteria,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    /**
     * Count mentors for pagination.
     */
    long countMentors(RDMentorSearchCriteria criteria);


    // -----------------------------------------
    // OPTIONAL (Future-proof AI text parsing support)
    // -----------------------------------------

    /**
     * Parse an enquiry text (free text entered by coordinator)
     * Example: "Need a female math mentor for Grade 7 CBSE online 6pm"
     * 
     * Extract:
     * - gender = Female
     * - skillCode = MATH
     * - grade = 7
     * - board = CBSE
     * - mode = Online
     */
    default RDMentorSearchCriteria parseEnquiryText(String text) {
        return null; // Implement only if needed
    }

	RDMentor getMentorById(Integer mentorId);
}
