package com.robodynamics.dao.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDContentRadarItemDao;
import com.robodynamics.model.RDContentRadarItem;

@Repository
public class RDContentRadarItemDaoImpl implements RDContentRadarItemDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDContentRadarItem item) {
        getCurrentSession().saveOrUpdate(item);
    }

    @Override
    public RDContentRadarItem findById(Long itemId) {
        if (itemId == null) {
            return null;
        }
        return getCurrentSession().get(RDContentRadarItem.class, itemId);
    }

    @Override
    public RDContentRadarItem findByCanonicalUrl(String canonicalUrl) {
        if (canonicalUrl == null || canonicalUrl.trim().isEmpty()) {
            return null;
        }
        return getCurrentSession()
                .createQuery("FROM RDContentRadarItem i WHERE i.canonicalUrl = :url", RDContentRadarItem.class)
                .setParameter("url", canonicalUrl.trim())
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public RDContentRadarItem findBySourceGuid(Long sourceId, String externalGuid) {
        if (sourceId == null || externalGuid == null || externalGuid.trim().isEmpty()) {
            return null;
        }
        return getCurrentSession()
                .createQuery("FROM RDContentRadarItem i WHERE i.sourceId = :sourceId AND i.externalGuid = :guid", RDContentRadarItem.class)
                .setParameter("sourceId", sourceId)
                .setParameter("guid", externalGuid.trim())
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public List<RDContentRadarItem> findLatest(String status, int limit) {
        int maxRows = Math.max(1, Math.min(limit, 500));
        if (status == null || status.trim().isEmpty()) {
            return findLatestAll(maxRows);
        }
        return getCurrentSession()
                .createQuery("FROM RDContentRadarItem i WHERE i.status = :status ORDER BY i.totalScore DESC, i.fetchedAt DESC",
                        RDContentRadarItem.class)
                .setParameter("status", status.trim().toUpperCase())
                .setMaxResults(maxRows)
                .getResultList();
    }

    @Override
    public List<RDContentRadarItem> findLatestAll(int limit) {
        int maxRows = Math.max(1, Math.min(limit, 500));
        return getCurrentSession()
                .createQuery("FROM RDContentRadarItem i ORDER BY i.fetchedAt DESC, i.totalScore DESC", RDContentRadarItem.class)
                .setMaxResults(maxRows)
                .getResultList();
    }

    @Override
    public List<RDContentRadarItem> findForWindow(LocalDateTime start, LocalDateTime end, List<String> statuses, int limit) {
        int maxRows = Math.max(1, Math.min(limit, 1000));
        if (start == null || end == null || !start.isBefore(end)) {
            return Collections.emptyList();
        }
        List<String> safeStatuses = (statuses == null || statuses.isEmpty()) ? Collections.emptyList() : statuses;
        if (safeStatuses.isEmpty()) {
            return getCurrentSession()
                    .createQuery("FROM RDContentRadarItem i WHERE i.fetchedAt >= :start AND i.fetchedAt < :end ORDER BY i.totalScore DESC, i.fetchedAt DESC",
                            RDContentRadarItem.class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .setMaxResults(maxRows)
                    .getResultList();
        }
        return getCurrentSession()
                .createQuery("FROM RDContentRadarItem i WHERE i.fetchedAt >= :start AND i.fetchedAt < :end " +
                                "AND i.status IN (:statuses) ORDER BY i.totalScore DESC, i.fetchedAt DESC",
                        RDContentRadarItem.class)
                .setParameter("start", start)
                .setParameter("end", end)
                .setParameterList("statuses", safeStatuses)
                .setMaxResults(maxRows)
                .getResultList();
    }
}
