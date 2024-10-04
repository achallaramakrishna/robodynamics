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

import com.robodynamics.dao.RDStudentSlideProgressDao;
import com.robodynamics.model.RDStudentSlideProgress;

@Repository
@Transactional
public class RDStudentSlideProgressDaoImpl implements RDStudentSlideProgressDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDStudentSlideProgress slideProgress) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(slideProgress);
    }

    @Override
    public RDStudentSlideProgress findById(int slideProgressId) {
        Session session = factory.getCurrentSession();
        return session.get(RDStudentSlideProgress.class, slideProgressId);
    }

    @Override
    public RDStudentSlideProgress findByEnrollmentAndSlide(int enrollmentId, int slideId) {
        CriteriaBuilder cb = factory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<RDStudentSlideProgress> cq = cb.createQuery(RDStudentSlideProgress.class);
        Root<RDStudentSlideProgress> root = cq.from(RDStudentSlideProgress.class);
        cq.select(root).where(
            cb.equal(root.get("enrollment").get("id"), enrollmentId),
            cb.equal(root.get("slide").get("id"), slideId)
        );
        return factory.getCurrentSession().createQuery(cq).uniqueResult();
    }

    @Override
    public List<RDStudentSlideProgress> findAllByEnrollmentId(int enrollmentId) {
        CriteriaBuilder cb = factory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<RDStudentSlideProgress> cq = cb.createQuery(RDStudentSlideProgress.class);
        Root<RDStudentSlideProgress> root = cq.from(RDStudentSlideProgress.class);
        cq.select(root).where(cb.equal(root.get("enrollment").get("id"), enrollmentId));
        return factory.getCurrentSession().createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDStudentSlideProgress slideProgress) {
        Session session = factory.getCurrentSession();
        session.delete(slideProgress);
    }
}
