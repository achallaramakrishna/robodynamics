package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCIAssessmentSessionDao;
import com.robodynamics.model.RDCIAssessmentSession;

@Repository
public class RDCIAssessmentSessionDaoImpl implements RDCIAssessmentSessionDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCIAssessmentSession assessmentSession) {
        getCurrentSession().saveOrUpdate(assessmentSession);
    }

    @Override
    public RDCIAssessmentSession findById(Long sessionId) {
        if (sessionId == null) {
            return null;
        }
        return getCurrentSession().get(RDCIAssessmentSession.class, sessionId);
    }

    @Override
    public List<RDCIAssessmentSession> findByStudentUserId(Integer studentUserId) {
        if (studentUserId == null) {
            return List.of();
        }
        return getCurrentSession()
                .createQuery(
                        "FROM RDCIAssessmentSession s WHERE s.studentUser.userID = :studentUserId ORDER BY s.createdAt DESC",
                        RDCIAssessmentSession.class)
                .setParameter("studentUserId", studentUserId)
                .getResultList();
    }

    @Override
    public Integer countBySubscriptionId(Long subscriptionId) {
        if (subscriptionId == null) {
            return 0;
        }
        Query<Long> query = getCurrentSession().createQuery(
                "SELECT COUNT(s.ciAssessmentSessionId) FROM RDCIAssessmentSession s WHERE s.subscription.ciSubscriptionId = :subscriptionId",
                Long.class);
        query.setParameter("subscriptionId", subscriptionId);
        Long count = query.uniqueResult();
        return count == null ? 0 : count.intValue();
    }

    @Override
    public RDCIAssessmentSession findLatestByStudentUserId(Integer studentUserId) {
        if (studentUserId == null) {
            return null;
        }
        List<RDCIAssessmentSession> rows = getCurrentSession()
                .createQuery(
                        "FROM RDCIAssessmentSession s WHERE s.studentUser.userID = :studentUserId ORDER BY s.createdAt DESC",
                        RDCIAssessmentSession.class)
                .setParameter("studentUserId", studentUserId)
                .setMaxResults(1)
                .getResultList();
        return rows.isEmpty() ? null : rows.get(0);
    }

    @Override
    public long countByStatus(String status) {
        Query<Long> query = getCurrentSession().createQuery(
                "SELECT COUNT(s.ciAssessmentSessionId) FROM RDCIAssessmentSession s WHERE s.status = :status",
                Long.class);
        query.setParameter("status", status);
        Long count = query.uniqueResult();
        return count == null ? 0L : count;
    }

    @Override
    public long countAll() {
        Long count = getCurrentSession().createQuery(
                "SELECT COUNT(s.ciAssessmentSessionId) FROM RDCIAssessmentSession s",
                Long.class).uniqueResult();
        return count == null ? 0L : count;
    }

    @Override
    public Double averageDurationSecondsForCompleted() {
        Double avg = getCurrentSession().createQuery(
                "SELECT AVG(s.durationSeconds) FROM RDCIAssessmentSession s " +
                        "WHERE s.status = 'COMPLETED' AND s.durationSeconds IS NOT NULL",
                Double.class).uniqueResult();
        return avg;
    }
}
