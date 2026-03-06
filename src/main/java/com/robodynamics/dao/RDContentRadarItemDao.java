package com.robodynamics.dao;

import java.time.LocalDateTime;
import java.util.List;

import com.robodynamics.model.RDContentRadarItem;

public interface RDContentRadarItemDao {

    void save(RDContentRadarItem item);

    RDContentRadarItem findById(Long itemId);

    RDContentRadarItem findByCanonicalUrl(String canonicalUrl);

    RDContentRadarItem findBySourceGuid(Long sourceId, String externalGuid);

    List<RDContentRadarItem> findLatest(String status, int limit);

    List<RDContentRadarItem> findLatestAll(int limit);

    List<RDContentRadarItem> findForWindow(LocalDateTime start, LocalDateTime end, List<String> statuses, int limit);
}
