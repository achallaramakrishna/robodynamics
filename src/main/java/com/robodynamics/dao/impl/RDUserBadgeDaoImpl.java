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

import com.robodynamics.dao.RDUserBadgeDao;
import com.robodynamics.model.RDUserBadge;

@Repository
@Transactional
public class RDUserBadgeDaoImpl implements RDUserBadgeDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDUserBadge userBadge) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(userBadge);
    }

    @Override
    public List<RDUserBadge> findByUserId(int userId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDUserBadge> cq = cb.createQuery(RDUserBadge.class);
        Root<RDUserBadge> root = cq.from(RDUserBadge.class);
        cq.select(root).where(cb.equal(root.get("user"), userId));
        return session.createQuery(cq).getResultList();
    }

    @Override
    public List<RDUserBadge> findAll() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDUserBadge> cq = cb.createQuery(RDUserBadge.class);
        Root<RDUserBadge> root = cq.from(RDUserBadge.class);
        cq.select(root);
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDUserBadge userBadge) {
        Session session = factory.getCurrentSession();
        session.delete(userBadge);
    }
}
