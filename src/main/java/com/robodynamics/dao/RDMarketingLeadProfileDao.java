package com.robodynamics.dao;

import java.util.Optional;

import com.robodynamics.model.RDMarketingLeadProfile;

public interface RDMarketingLeadProfileDao {

    RDMarketingLeadProfile saveOrUpdate(RDMarketingLeadProfile profile);

    Optional<RDMarketingLeadProfile> findByLeadId(Long leadId);
}
