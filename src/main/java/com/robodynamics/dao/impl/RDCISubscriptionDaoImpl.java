package com.robodynamics.dao.impl;

import java.util.List;
import java.time.LocalDateTime;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCISubscriptionDao;
import com.robodynamics.model.RDCISubscription;

@Repository
public class RDCISubscriptionDaoImpl implements RDCISubscriptionDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCISubscription subscription) {
        getCurrentSession().saveOrUpdate(subscription);
    }

    @Override
    public RDCISubscription findById(Long subscriptionId) {
        if (subscriptionId == null) {
            return null;
        }
        return getCurrentSession().get(RDCISubscription.class, subscriptionId);
    }

    @Override
    public RDCISubscription findByProviderOrderId(String providerOrderId) {
        if (providerOrderId == null || providerOrderId.trim().isEmpty()) {
            return null;
        }
        Query<RDCISubscription> query = getCurrentSession().createQuery(
                "FROM RDCISubscription s WHERE s.providerOrderId = :providerOrderId",
                RDCISubscription.class);
        query.setParameter("providerOrderId", providerOrderId.trim());
        return query.uniqueResult();
    }

    @Override
    public List<RDCISubscription> findByParentUserId(Integer parentUserId) {
        if (parentUserId == null) {
            return List.of();
        }
        return getCurrentSession()
                .createQuery(
                        "FROM RDCISubscription s WHERE s.parentUser.userID = :parentUserId ORDER BY s.createdAt DESC",
                        RDCISubscription.class)
                .setParameter("parentUserId", parentUserId)
                .getResultList();
    }

    @Override
    public RDCISubscription findLatestByStudentUserId(Integer studentUserId) {
        if (studentUserId == null) {
            return null;
        }
        List<RDCISubscription> rows = getCurrentSession()
                .createQuery(
                        "FROM RDCISubscription s WHERE s.studentUser.userID = :studentUserId ORDER BY s.createdAt DESC",
                        RDCISubscription.class)
                .setParameter("studentUserId", studentUserId)
                .setMaxResults(1)
                .getResultList();
        return rows.isEmpty() ? null : rows.get(0);
    }

    @Override
    public RDCISubscription findLatestActiveAptiPathByStudentUserId(Integer studentUserId) {
        return findLatestActiveByStudentUserIdAndModuleCode(studentUserId, "APTIPATH");
    }

    @Override
    public RDCISubscription findLatestActiveByStudentUserIdAndModuleCode(Integer studentUserId, String moduleCode) {
        if (studentUserId == null) {
            return null;
        }
        if (moduleCode == null || moduleCode.trim().isEmpty()) {
            return null;
        }
        LocalDateTime now = LocalDateTime.now();
        List<RDCISubscription> rows = getCurrentSession()
                .createQuery(
                        "FROM RDCISubscription s " +
                                "WHERE s.studentUser.userID = :studentUserId " +
                                "AND s.moduleCode = :moduleCode " +
                                "AND s.status = :status " +
                                "AND (s.endAt IS NULL OR s.endAt >= :now) " +
                                "ORDER BY s.createdAt DESC",
                        RDCISubscription.class)
                .setParameter("studentUserId", studentUserId)
                .setParameter("moduleCode", moduleCode.trim())
                .setParameter("status", "ACTIVE")
                .setParameter("now", now)
                .setMaxResults(1)
                .getResultList();
        return rows.isEmpty() ? null : rows.get(0);
    }

    @Override
    public long countByModuleAndStatus(String moduleCode, String status) {
        Query<Long> query = getCurrentSession().createQuery(
                "SELECT COUNT(s.ciSubscriptionId) FROM RDCISubscription s " +
                        "WHERE (:moduleCode IS NULL OR s.moduleCode = :moduleCode) " +
                        "AND (:status IS NULL OR s.status = :status)",
                Long.class);
        query.setParameter("moduleCode", moduleCode);
        query.setParameter("status", status);
        Long count = query.uniqueResult();
        return count == null ? 0L : count;
    }
}
