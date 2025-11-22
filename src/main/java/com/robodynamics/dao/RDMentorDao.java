

package com.robodynamics.dao;

import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.dto.RDMentorSearchCriteria;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentor;

import java.util.List;

public interface RDMentorDao {

    // -------------------------------------------------------
    // BASIC QUERIES
    // -------------------------------------------------------
    List<RDMentorDTO> findAllMentorsBasic();

    List<RDMentorDTO> findMentorsSummary();

    List<RDMentorDTO> findFeaturedMentors();


    // -------------------------------------------------------
    // FETCH MENTOR DETAILS
    // -------------------------------------------------------
    RDMentor findByUserId(int userId);

    RDMentor getMentorById(int mentorId);

    RDMentor getMentorWithSkills(int mentorId);


    // -------------------------------------------------------
    // SAVE / UPDATE
    // -------------------------------------------------------
    void save(RDMentor mentor);

    void update(RDMentor mentor);


    // -------------------------------------------------------
    // LEAD → MENTOR MATCHING
    // -------------------------------------------------------
    List<RDMentor> findMentorsForLead(RDLead lead);


    // -------------------------------------------------------
    // PROFILE CHECK
    // -------------------------------------------------------
    boolean hasMentorProfile(int userID);


    // -------------------------------------------------------
    // ❗️NOTE: no search() or countForSearch() here
    // Search is fully implemented in RDMentorServiceImpl
    // -------------------------------------------------------
}
