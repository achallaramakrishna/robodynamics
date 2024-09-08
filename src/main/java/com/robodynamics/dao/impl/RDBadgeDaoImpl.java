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

import com.robodynamics.dao.RDBadgeDao;
import com.robodynamics.model.RDBadge;

@Repository
@Transactional
public class RDBadgeDaoImpl implements RDBadgeDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDBadge badge) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(badge);
    }

    @Override
    public RDBadge findById(int badgeId) {
        Session session = factory.getCurrentSession();
        return session.get(RDBadge.class, badgeId);
    }

    @Override
    public List<RDBadge> findAll() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDBadge> cq = cb.createQuery(RDBadge.class);
        Root<RDBadge> root = cq.from(RDBadge.class);
        cq.select(root);
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDBadge badge) {
        Session session = factory.getCurrentSession();
        session.delete(badge);
    }
}
