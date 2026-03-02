package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDMarketingAgentTask;

public interface RDMarketingAgentTaskDao {

    RDMarketingAgentTask saveOrUpdate(RDMarketingAgentTask task);

    List<RDMarketingAgentTask> findPendingByLeadId(Long leadId);
}
