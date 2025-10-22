package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDExpenseCategoryDao;
import com.robodynamics.model.RDExpenseCategory;

@Repository
public class RDExpenseCategoryDaoImpl implements RDExpenseCategoryDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session session() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDExpenseCategory category) {
        session().save(category);
    }

    @Override
    public void update(RDExpenseCategory category) {
        session().update(category);
    }

    @Override
    public void delete(Integer categoryId) {
        RDExpenseCategory cat = findById(categoryId);
        if (cat != null) session().delete(cat);
    }

    @Override
    public RDExpenseCategory findById(Integer categoryId) {
        return session().get(RDExpenseCategory.class, categoryId);
    }

    @Override
    public List<RDExpenseCategory> findAll() {
        return session().createQuery("FROM RDExpenseCategory ORDER BY categoryName", RDExpenseCategory.class).list();
    }
}
