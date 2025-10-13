package com.robodynamics.service;

import com.robodynamics.model.RDParentNeed;

public interface RDParentNeedService {
    void saveNeeds(Long leadId, String learningPace, String interestLevel,
                   String objective, String subjectPriority, String teacherStyle);

    RDParentNeed getNeedsByLead(Long leadId);
}
