package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCIRecommendationSnapshotDao;
import com.robodynamics.model.RDCIRecommendationSnapshot;

@Repository
public class RDCIRecommendationSnapshotDaoImpl implements RDCIRecommendationSnapshotDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCIRecommendationSnapshot snapshot) {
        getCurrentSession().saveOrUpdate(snapshot);
    }

    @Override
    public List<RDCIRecommendationSnapshot> findByAssessmentSessionId(Long assessmentSessionId) {
        if (assessmentSessionId == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCIRecommendationSnapshot r " +
                        "WHERE r.assessmentSession.ciAssessmentSessionId = :sessionId " +
                        "ORDER BY r.createdAt DESC",
                RDCIRecommendationSnapshot.class)
                .setParameter("sessionId", assessmentSessionId)
                .getResultList();
    }

    @Override
    public RDCIRecommendationSnapshot findByAssessmentSessionIdAndVersion(Long assessmentSessionId, String recommendationVersion) {
        if (assessmentSessionId == null || recommendationVersion == null || recommendationVersion.trim().isEmpty()) {
            return null;
        }
        return getCurrentSession().createQuery(
                "FROM RDCIRecommendationSnapshot r " +
                        "WHERE r.assessmentSession.ciAssessmentSessionId = :sessionId " +
                        "AND r.recommendationVersion = :version",
                RDCIRecommendationSnapshot.class)
                .setParameter("sessionId", assessmentSessionId)
                .setParameter("version", recommendationVersion.trim())
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public RDCIRecommendationSnapshot findLatestByAssessmentSessionId(Long assessmentSessionId) {
        List<RDCIRecommendationSnapshot> rows = findByAssessmentSessionId(assessmentSessionId);
        return rows.isEmpty() ? null : rows.get(0);
    }
}
