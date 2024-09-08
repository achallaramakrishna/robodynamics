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

import com.robodynamics.dao.RDUserPointsDao;
import com.robodynamics.model.RDUserPoints;

@Repository
@Transactional
public class RDUserPointsDaoImpl implements RDUserPointsDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDUserPoints userPoints) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(userPoints);
    }

    @Override
    public RDUserPoints findByUserId(int userId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDUserPoints> cq = cb.createQuery(RDUserPoints.class);
        Root<RDUserPoints> root = cq.from(RDUserPoints.class);
        cq.select(root).where(cb.equal(root.get("user"), userId));
        return session.createQuery(cq).uniqueResult();
    }

    @Override
    public List<RDUserPoints> findAll() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDUserPoints> cq = cb.createQuery(RDUserPoints.class);
        Root<RDUserPoints> root = cq.from(RDUserPoints.class);
        cq.select(root);
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDUserPoints userPoints) {
        Session session = factory.getCurrentSession();
        session.delete(userPoints);
    }
}
