package com.robodynamics.dao;

import com.robodynamics.model.RDParentNeed;

public interface RDParentNeedDao {
    void save(RDParentNeed need);
    RDParentNeed findByLeadId(Long leadId);
}
