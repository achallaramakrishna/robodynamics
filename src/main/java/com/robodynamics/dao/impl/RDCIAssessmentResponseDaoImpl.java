package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCIAssessmentResponseDao;
import com.robodynamics.model.RDCIAssessmentResponse;

@Repository
public class RDCIAssessmentResponseDaoImpl implements RDCIAssessmentResponseDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCIAssessmentResponse response) {
        getCurrentSession().saveOrUpdate(response);
    }

    @Override
    public RDCIAssessmentResponse findBySessionIdAndQuestionCode(Long sessionId, String questionCode) {
        if (sessionId == null || questionCode == null || questionCode.trim().isEmpty()) {
            return null;
        }
        Query<RDCIAssessmentResponse> query = getCurrentSession().createQuery(
                "FROM RDCIAssessmentResponse r " +
                        "WHERE r.assessmentSession.ciAssessmentSessionId = :sessionId " +
                        "AND r.questionCode = :questionCode",
                RDCIAssessmentResponse.class);
        query.setParameter("sessionId", sessionId);
        query.setParameter("questionCode", questionCode.trim().toUpperCase());
        return query.uniqueResult();
    }

    @Override
    public List<RDCIAssessmentResponse> findBySessionId(Long sessionId) {
        if (sessionId == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCIAssessmentResponse r " +
                        "WHERE r.assessmentSession.ciAssessmentSessionId = :sessionId " +
                        "ORDER BY r.questionCode ASC",
                RDCIAssessmentResponse.class)
                .setParameter("sessionId", sessionId)
                .getResultList();
    }
}
