package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFlashCardAttemptDao;
import com.robodynamics.model.RDFlashCardAttempt;

@Repository
@Transactional
public class RDFlashCardAttemptDaoImpl implements RDFlashCardAttemptDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveRDFlashCardAttempt(RDFlashCardAttempt rdFlashCardAttempt) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(rdFlashCardAttempt);
    }

    @Override
    public RDFlashCardAttempt getRDFlashCardAttempt(int attemptId) {
        Session session = factory.getCurrentSession();
        return session.get(RDFlashCardAttempt.class, attemptId);
    }

    @Override
    public List<RDFlashCardAttempt> getRDFlashCardAttempts() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDFlashCardAttempt> cq = cb.createQuery(RDFlashCardAttempt.class);
        Root<RDFlashCardAttempt> root = cq.from(RDFlashCardAttempt.class);
        cq.select(root);
        Query<RDFlashCardAttempt> query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public List<RDFlashCardAttempt> getAttemptsByFlashCard(int flashCardId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDFlashCardAttempt> cq = cb.createQuery(RDFlashCardAttempt.class);
        Root<RDFlashCardAttempt> root = cq.from(RDFlashCardAttempt.class);
        cq.select(root).where(cb.equal(root.get("flashCardId"), flashCardId));
        Query<RDFlashCardAttempt> query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public List<RDFlashCardAttempt> getAttemptsByUser(int userId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDFlashCardAttempt> cq = cb.createQuery(RDFlashCardAttempt.class);
        Root<RDFlashCardAttempt> root = cq.from(RDFlashCardAttempt.class);
        cq.select(root).where(cb.equal(root.get("userId"), userId));
        Query<RDFlashCardAttempt> query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public void deleteRDFlashCardAttempt(int id) {
        Session session = factory.getCurrentSession();
        RDFlashCardAttempt attempt = session.byId(RDFlashCardAttempt.class).load(id);
        session.delete(attempt);
    }
}
