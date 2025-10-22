package com.robodynamics.dao.impl;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDOperationalExpenseDao;
import com.robodynamics.model.RDOperationalExpense;

@Repository
public class RDOperationalExpenseDaoImpl implements RDOperationalExpenseDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session currentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDOperationalExpense expense) {
        currentSession().save(expense);
    }

    @Override
    public void update(RDOperationalExpense expense) {
        currentSession().update(expense);
    }

    @Override
    public void delete(Integer expenseId) {
        RDOperationalExpense exp = findById(expenseId);
        if (exp != null) currentSession().delete(exp);
    }

    @Override
    public RDOperationalExpense findById(Integer expenseId) {
        return currentSession().get(RDOperationalExpense.class, expenseId);
    }

    @Override
    public List<RDOperationalExpense> findAll() {
        String hql = "FROM RDOperationalExpense e LEFT JOIN FETCH e.category ORDER BY e.expenseDate DESC";
        return currentSession().createQuery(hql, RDOperationalExpense.class).list();
    }
}
