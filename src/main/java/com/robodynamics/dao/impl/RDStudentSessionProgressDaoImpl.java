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

import com.robodynamics.dao.RDStudentSessionProgressDao;
import com.robodynamics.model.RDStudentSessionProgress;

@Repository
@Transactional
public class RDStudentSessionProgressDaoImpl implements RDStudentSessionProgressDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDStudentSessionProgress sessionProgress) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(sessionProgress);
    }

    @Override
    public RDStudentSessionProgress findById(int sessionProgressId) {
        Session session = factory.getCurrentSession();
        return session.get(RDStudentSessionProgress.class, sessionProgressId);
    }

    @Override
    public RDStudentSessionProgress findByEnrollmentAndSession(int enrollmentId, int sessionId) {
        CriteriaBuilder cb = factory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<RDStudentSessionProgress> cq = cb.createQuery(RDStudentSessionProgress.class);
        Root<RDStudentSessionProgress> root = cq.from(RDStudentSessionProgress.class);
        cq.select(root).where(
            cb.equal(root.get("enrollment").get("id"), enrollmentId),
            cb.equal(root.get("courseSession").get("id"), sessionId)
        );
        return factory.getCurrentSession().createQuery(cq).uniqueResult();
    }

    @Override
    public List<RDStudentSessionProgress> findAllByEnrollmentId(int enrollmentId) {
        CriteriaBuilder cb = factory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<RDStudentSessionProgress> cq = cb.createQuery(RDStudentSessionProgress.class);
        Root<RDStudentSessionProgress> root = cq.from(RDStudentSessionProgress.class);
        cq.select(root).where(cb.equal(root.get("enrollment").get("id"), enrollmentId));
        return factory.getCurrentSession().createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDStudentSessionProgress sessionProgress) {
        Session session = factory.getCurrentSession();
        session.delete(sessionProgress);
    }
}
