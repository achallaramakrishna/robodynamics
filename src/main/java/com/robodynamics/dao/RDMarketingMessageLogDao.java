package com.robodynamics.dao;

import java.time.LocalDateTime;
import java.util.List;

import com.robodynamics.model.RDMarketingMessageLog;

public interface RDMarketingMessageLogDao {

    RDMarketingMessageLog save(RDMarketingMessageLog log);

    List<RDMarketingMessageLog> findRecentByLeadId(Long leadId, int limit);

    long countByDirectionAndRange(String direction, LocalDateTime from, LocalDateTime toExclusive);
}
