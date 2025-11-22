package com.robodynamics.service;

import java.util.List;

import com.robodynamics.dto.SkillDTO;
import com.robodynamics.model.RDMentorSkill;

public interface RDMentorSkillService {

    /**
     * Returns all mentor skills available in the system.
     */
    List<RDMentorSkill> getAllSkills();

    List<SkillDTO> findAllDistinctSkills();

    /**
     * Returns a list of distinct skill codes (e.g., "MATH", "PHYSICS", "ROBOTICS").
     */
    List<String> getAllSkillCodes();

    /**
     * Returns skills for a specific mentor.
     */
    List<RDMentorSkill> getSkillsForMentor(Integer mentorId);
}
