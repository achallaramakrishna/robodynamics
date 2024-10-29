package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserQuizAnswerDao;
import com.robodynamics.model.RDUserQuizAnswer;

@Repository
@Transactional
public class RDUserQuizAnswerDaoImpl implements RDUserQuizAnswerDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void saveRDUserQuizAnswer(RDUserQuizAnswer rdUserQuizAnswer) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(rdUserQuizAnswer);
    }

    @Override
    public RDUserQuizAnswer getRDUserQuizAnswer(int answerId) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(RDUserQuizAnswer.class, answerId);
    }

    @Override
    public List<RDUserQuizAnswer> getAnswersByUserAndQuiz(int userId, int quizId) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDUserQuizAnswer> cq = cb.createQuery(RDUserQuizAnswer.class);
        Root<RDUserQuizAnswer> root = cq.from(RDUserQuizAnswer.class);
        
        Predicate userPredicate = cb.equal(root.get("userId"), userId);
        Predicate quizPredicate = cb.equal(root.get("quizId"), quizId);
        cq.where(cb.and(userPredicate, quizPredicate));

        return session.createQuery(cq).getResultList();
    }

    @Override
    public void deleteRDUserQuizAnswer(int answerId) {
        Session session = sessionFactory.getCurrentSession();
        RDUserQuizAnswer answer = session.byId(RDUserQuizAnswer.class).load(answerId);
        session.delete(answer);
    }
}
