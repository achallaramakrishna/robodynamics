package com.robodynamics.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDExamAttemptAnswerDao;
import com.robodynamics.model.RDExamAttemptAnswer;

@Repository
@Transactional
public class RDExamAttemptAnswerDaoImpl implements RDExamAttemptAnswerDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDExamAttemptAnswer attemptAnswer) {
        factory.getCurrentSession().saveOrUpdate(attemptAnswer);
    }

    @Override
    public RDExamAttemptAnswer getById(int attemptAnswerId) {
        return factory.getCurrentSession()
                .get(RDExamAttemptAnswer.class, attemptAnswerId);
    }

    @Override
    public RDExamAttemptAnswer findByAttemptAndQuestion(
            int attemptId,
            int examSectionQuestionId,
            int questionId) {

        String hql = "FROM RDExamAttemptAnswer a " +
                     "WHERE a.attempt.attemptId = :attemptId " +
                     "AND a.sectionQuestion.id = :sectionQuestionId " +
                     "AND a.question.questionId = :questionId";

        Query<RDExamAttemptAnswer> query = factory.getCurrentSession().createQuery(hql);
        query.setParameter("attemptId", attemptId);
        query.setParameter("sectionQuestionId", examSectionQuestionId);
        query.setParameter("questionId", questionId);

        return query.uniqueResult();
    }

    @Override
    public List<RDExamAttemptAnswer> findByAttemptId(int attemptId) {
        String hql = "FROM RDExamAttemptAnswer a " +
                     "WHERE a.attempt.attemptId = :attemptId " +
                     "ORDER BY a.createdAt ASC";

        return factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("attemptId", attemptId)
                .list();
    }

    @Override
    public List<RDExamAttemptAnswer> findByQuestionId(int questionId) {
        String hql = "FROM RDExamAttemptAnswer a " +
                     "WHERE a.question.questionId = :questionId";

        return factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("questionId", questionId)
                .list();
    }

    @Override
    public void updateScore(int attemptAnswerId, double score) {
        Session session = factory.getCurrentSession();
        RDExamAttemptAnswer answer = session.get(RDExamAttemptAnswer.class, attemptAnswerId);

        if (answer == null) return;
        
        answer.setScore(BigDecimal.valueOf(score));

        session.update(answer);
    }

    @Override
    public void deleteByAttemptId(int attemptId) {
        String hql = "DELETE FROM RDExamAttemptAnswer a " +
                     "WHERE a.attempt.attemptId = :attemptId";

        factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("attemptId", attemptId)
                .executeUpdate();
    }
}
