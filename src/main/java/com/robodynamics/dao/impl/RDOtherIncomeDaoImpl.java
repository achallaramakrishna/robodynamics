package com.robodynamics.dao.impl;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDOtherIncomeDao;
import com.robodynamics.model.RDOtherIncome;

@Repository
public class RDOtherIncomeDaoImpl implements RDOtherIncomeDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session currentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDOtherIncome income) {
        currentSession().save(income);
    }

    @Override
    public void update(RDOtherIncome income) {
        currentSession().update(income);
    }

    @Override
    public void delete(Integer incomeId) {
        RDOtherIncome inc = findById(incomeId);
        if (inc != null) currentSession().delete(inc);
    }

    @Override
    public RDOtherIncome findById(Integer incomeId) {
        return currentSession().get(RDOtherIncome.class, incomeId);
    }

    @Override
    public List<RDOtherIncome> findAll() {
        String hql = "FROM RDOtherIncome ORDER BY incomeDate DESC";
        return currentSession().createQuery(hql, RDOtherIncome.class).list();
    }
}
