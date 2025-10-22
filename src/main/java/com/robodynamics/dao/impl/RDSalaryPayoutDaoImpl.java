package com.robodynamics.dao.impl;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDSalaryPayoutDao;
import com.robodynamics.model.RDSalaryPayout;

@Repository
public class RDSalaryPayoutDaoImpl implements RDSalaryPayoutDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session session() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDSalaryPayout payout) {
        session().save(payout);
    }

    @Override
    public void update(RDSalaryPayout payout) {
        session().update(payout);
    }

    @Override
    public void delete(Integer salaryId) {
        RDSalaryPayout sp = findById(salaryId);
        if (sp != null) session().delete(sp);
    }

    @Override
    public RDSalaryPayout findById(Integer salaryId) {
        return session().get(RDSalaryPayout.class, salaryId);
    }

    @Override
    public List<RDSalaryPayout> findAll() {
        String hql = "FROM RDSalaryPayout s LEFT JOIN FETCH s.employee ORDER BY s.monthFor DESC";
        return session().createQuery(hql, RDSalaryPayout.class).list();
    }
}
