package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCIQuestionBankDao;
import com.robodynamics.model.RDCIQuestionBank;

@Repository
public class RDCIQuestionBankDaoImpl implements RDCIQuestionBankDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCIQuestionBank question) {
        getCurrentSession().saveOrUpdate(question);
    }

    @Override
    public List<RDCIQuestionBank> findActiveByModuleAndVersion(String moduleCode, String assessmentVersion) {
        if (moduleCode == null || assessmentVersion == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCIQuestionBank q " +
                        "WHERE q.moduleCode = :moduleCode " +
                        "AND q.assessmentVersion = :assessmentVersion " +
                        "AND q.status = 'ACTIVE' " +
                        "ORDER BY q.sequenceNo ASC",
                RDCIQuestionBank.class)
                .setParameter("moduleCode", moduleCode.trim().toUpperCase())
                .setParameter("assessmentVersion", assessmentVersion.trim())
                .getResultList();
    }

    @Override
    public RDCIQuestionBank findByModuleVersionAndQuestionCode(String moduleCode, String assessmentVersion, String questionCode) {
        if (moduleCode == null || assessmentVersion == null || questionCode == null) {
            return null;
        }
        Query<RDCIQuestionBank> query = getCurrentSession().createQuery(
                "FROM RDCIQuestionBank q " +
                        "WHERE q.moduleCode = :moduleCode " +
                        "AND q.assessmentVersion = :assessmentVersion " +
                        "AND q.questionCode = :questionCode",
                RDCIQuestionBank.class);
        query.setParameter("moduleCode", moduleCode.trim().toUpperCase());
        query.setParameter("assessmentVersion", assessmentVersion.trim());
        query.setParameter("questionCode", questionCode.trim().toUpperCase());
        return query.uniqueResult();
    }

    @Override
    public long countByModuleAndVersion(String moduleCode, String assessmentVersion) {
        if (moduleCode == null || assessmentVersion == null) {
            return 0L;
        }
        Query<Long> query = getCurrentSession().createQuery(
                "SELECT COUNT(q.ciQuestionId) FROM RDCIQuestionBank q " +
                        "WHERE q.moduleCode = :moduleCode " +
                        "AND q.assessmentVersion = :assessmentVersion",
                Long.class);
        query.setParameter("moduleCode", moduleCode.trim().toUpperCase());
        query.setParameter("assessmentVersion", assessmentVersion.trim());
        Long count = query.uniqueResult();
        return count == null ? 0L : count;
    }
}
