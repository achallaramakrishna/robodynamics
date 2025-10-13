// src/main/java/com/robodynamics/dao/RDMentorDao.java
package com.robodynamics.dao;

import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentor;

import java.util.List;

public interface RDMentorDao {
	
	RDMentor findByUserId(int userId);
	void save(RDMentor mentor);
	void update(RDMentor mentor);
    List<RDMentorDTO> findAllMentorsBasic();
    List<RDMentorDTO> findMentorsSummary(); // with offeringsCount
	List<RDMentorDTO> findFeaturedMentors();
	List<RDMentor> findMentorsForLead(RDLead lead);
	RDMentor getMentorById(int mentorId);
	RDMentor getMentorWithSkills(int mentorId);
	boolean hasMentorProfile(int userID);
}
