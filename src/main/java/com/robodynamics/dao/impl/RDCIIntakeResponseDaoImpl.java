package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCIIntakeResponseDao;
import com.robodynamics.model.RDCIIntakeResponse;

@Repository
public class RDCIIntakeResponseDaoImpl implements RDCIIntakeResponseDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCIIntakeResponse intakeResponse) {
        getCurrentSession().saveOrUpdate(intakeResponse);
    }

    @Override
    public RDCIIntakeResponse findBySubscriptionRespondentQuestion(Long subscriptionId, String respondentType, String questionCode) {
        if (subscriptionId == null || respondentType == null || questionCode == null) {
            return null;
        }
        Query<RDCIIntakeResponse> query = getCurrentSession().createQuery(
                "FROM RDCIIntakeResponse r " +
                        "WHERE r.subscription.ciSubscriptionId = :subscriptionId " +
                        "AND r.respondentType = :respondentType " +
                        "AND r.questionCode = :questionCode",
                RDCIIntakeResponse.class);
        query.setParameter("subscriptionId", subscriptionId);
        query.setParameter("respondentType", respondentType);
        query.setParameter("questionCode", questionCode);
        return query.uniqueResult();
    }

    @Override
    public List<RDCIIntakeResponse> findBySubscriptionId(Long subscriptionId) {
        if (subscriptionId == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCIIntakeResponse r WHERE r.subscription.ciSubscriptionId = :subscriptionId " +
                        "ORDER BY r.respondentType ASC, r.sectionCode ASC, r.questionCode ASC",
                RDCIIntakeResponse.class)
                .setParameter("subscriptionId", subscriptionId)
                .getResultList();
    }
}
