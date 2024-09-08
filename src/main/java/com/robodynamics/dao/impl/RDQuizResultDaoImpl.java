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

import com.robodynamics.dao.RDQuizResultDao;
import com.robodynamics.model.RDQuizResult;

@Repository
@Transactional
public class RDQuizResultDaoImpl implements RDQuizResultDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDQuizResult quizResult) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(quizResult);
    }

    @Override
    public RDQuizResult findById(int resultId) {
        Session session = factory.getCurrentSession();
        return session.get(RDQuizResult.class, resultId);
    }

    @Override
    public List<RDQuizResult> findByUserId(int userId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDQuizResult> cq = cb.createQuery(RDQuizResult.class);
        Root<RDQuizResult> root = cq.from(RDQuizResult.class);
        cq.select(root).where(cb.equal(root.get("user"), userId));
        return session.createQuery(cq).getResultList();
    }

    @Override
    public List<RDQuizResult> findByQuizId(int quizId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDQuizResult> cq = cb.createQuery(RDQuizResult.class);
        Root<RDQuizResult> root = cq.from(RDQuizResult.class);
        cq.select(root).where(cb.equal(root.get("quiz"), quizId));
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDQuizResult quizResult) {
        Session session = factory.getCurrentSession();
        session.delete(quizResult);
    }
}
