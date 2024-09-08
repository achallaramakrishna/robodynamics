package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizAnswerDao;
import com.robodynamics.model.RDQuizAnswer;

@Repository
@Transactional
public class RDQuizAnswerDaoImpl implements RDQuizAnswerDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDQuizAnswer quizAnswer) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(quizAnswer);
    }

    @Override
    public RDQuizAnswer findById(int answerId) {
        Session session = factory.getCurrentSession();
        return session.get(RDQuizAnswer.class, answerId);
    }

    @Override
    public List<RDQuizAnswer> findByResultId(int resultId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDQuizAnswer> cq = cb.createQuery(RDQuizAnswer.class);
        Root<RDQuizAnswer> root = cq.from(RDQuizAnswer.class);
        cq.select(root).where(cb.equal(root.get("quizResult"), resultId));
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDQuizAnswer quizAnswer) {
        Session session = factory.getCurrentSession();
        session.delete(quizAnswer);
    }
}
