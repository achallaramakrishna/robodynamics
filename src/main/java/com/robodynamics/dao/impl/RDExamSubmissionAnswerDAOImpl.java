package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDExamSubmissionAnswerDAO;
import com.robodynamics.model.RDExamSubmissionAnswer;

@Repository
public class RDExamSubmissionAnswerDAOImpl
        implements RDExamSubmissionAnswerDAO {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDExamSubmissionAnswer answer) {
        getCurrentSession().save(answer);
    }

    @Override
    public void deleteBySubmissionId(Integer submissionId) {
        getCurrentSession()
            .createQuery(
                "delete from RDExamSubmissionAnswer a " +
                "where a.submission.submissionId = :submissionId"
            )
            .setParameter("submissionId", submissionId)
            .executeUpdate();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDExamSubmissionAnswer> findBySubmissionId(Integer submissionId) {
        return getCurrentSession()
            .createQuery(
                "from RDExamSubmissionAnswer a " +
                "where a.submission.submissionId = :submissionId " +
                "order by a.sectionQuestion.id"
            )
            .setParameter("submissionId", submissionId)
            .list();
    }
}
