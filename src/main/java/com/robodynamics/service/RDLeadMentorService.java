package com.robodynamics.service;

import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentorAssignment;
import com.robodynamics.model.RDUser;

import java.time.LocalDateTime;
import java.util.List;

public interface RDLeadMentorService {

    /** Match a lead to mentors based on subjects/skills */
    void assignLeadToMentors(RDLead lead);
    
    List<RDMentorAssignment> getAssignmentsForLead(Long leadId);
    
    List<RDLead> getLeadsForMentor(Integer mentorId);


    /** Get list of mentors assigned to a lead */
    List<RDUser> getMentorsForLead(Long leadId);

    /** Mentor claims a lead */
    void claimLead(Long leadId, Long mentorId, Long skillId);

    /** Mentor proposes alternate demo date */
    void proposeDemoDate(Long leadId, Long mentorId, Long skillId, LocalDateTime newDateTime);
}
