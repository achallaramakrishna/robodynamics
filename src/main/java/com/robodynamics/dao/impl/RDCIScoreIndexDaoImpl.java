package com.robodynamics.dao.impl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCIScoreIndexDao;
import com.robodynamics.model.RDCIScoreIndex;

@Repository
public class RDCIScoreIndexDaoImpl implements RDCIScoreIndexDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCIScoreIndex scoreIndex) {
        getCurrentSession().saveOrUpdate(scoreIndex);
    }

    @Override
    public RDCIScoreIndex findByAssessmentSessionId(Long assessmentSessionId) {
        if (assessmentSessionId == null) {
            return null;
        }
        Query<RDCIScoreIndex> query = getCurrentSession().createQuery(
                "FROM RDCIScoreIndex s WHERE s.assessmentSession.ciAssessmentSessionId = :sessionId",
                RDCIScoreIndex.class);
        query.setParameter("sessionId", assessmentSessionId);
        return query.uniqueResult();
    }

    @Override
    public Double averageOverallFitScore() {
        return getCurrentSession().createQuery(
                "SELECT AVG(s.overallFitScore) FROM RDCIScoreIndex s WHERE s.overallFitScore IS NOT NULL",
                Double.class).uniqueResult();
    }

    @Override
    public Double averageAiReadinessIndex() {
        return getCurrentSession().createQuery(
                "SELECT AVG(s.aiReadinessIndex) FROM RDCIScoreIndex s WHERE s.aiReadinessIndex IS NOT NULL",
                Double.class).uniqueResult();
    }

    @Override
    public Double averageAlignmentIndex() {
        return getCurrentSession().createQuery(
                "SELECT AVG(s.alignmentIndex) FROM RDCIScoreIndex s WHERE s.alignmentIndex IS NOT NULL",
                Double.class).uniqueResult();
    }

    @Override
    public Double averageWellbeingRiskIndex() {
        return getCurrentSession().createQuery(
                "SELECT AVG(s.wellbeingRiskIndex) FROM RDCIScoreIndex s WHERE s.wellbeingRiskIndex IS NOT NULL",
                Double.class).uniqueResult();
    }

    @Override
    public Long countByWellbeingRiskAtOrAbove(double threshold) {
        Long count = getCurrentSession().createQuery(
                "SELECT COUNT(s.ciScoreIndexId) FROM RDCIScoreIndex s " +
                        "WHERE s.wellbeingRiskIndex IS NOT NULL AND s.wellbeingRiskIndex >= :threshold",
                Long.class)
                .setParameter("threshold", threshold)
                .uniqueResult();
        return count == null ? 0L : count;
    }

    @Override
    public Long countByAlignmentAtOrBelow(double threshold) {
        Long count = getCurrentSession().createQuery(
                "SELECT COUNT(s.ciScoreIndexId) FROM RDCIScoreIndex s " +
                        "WHERE s.alignmentIndex IS NOT NULL AND s.alignmentIndex <= :threshold",
                Long.class)
                .setParameter("threshold", threshold)
                .uniqueResult();
        return count == null ? 0L : count;
    }
}
