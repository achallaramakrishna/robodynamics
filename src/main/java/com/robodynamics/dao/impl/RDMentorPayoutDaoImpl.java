package com.robodynamics.dao.impl;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDMentorPayoutDao;
import com.robodynamics.model.RDMentorPayout;

@Repository
public class RDMentorPayoutDaoImpl implements RDMentorPayoutDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session currentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDMentorPayout payout) {
        currentSession().save(payout);
    }

    @Override
    public void update(RDMentorPayout payout) {
        currentSession().update(payout);
    }

    @Override
    public void delete(Integer payoutId) {
        RDMentorPayout p = findById(payoutId);
        if (p != null) currentSession().delete(p);
    }

    @Override
    public RDMentorPayout findById(Integer payoutId) {
        return currentSession().get(RDMentorPayout.class, payoutId);
    }

    @Override
    public List<RDMentorPayout> findAll() {
        String hql = "FROM RDMentorPayout p LEFT JOIN FETCH p.mentor LEFT JOIN FETCH p.courseOffering ORDER BY p.payoutDate DESC";
        return currentSession().createQuery(hql, RDMentorPayout.class).list();
    }
}
