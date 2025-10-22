package com.robodynamics.dao.impl;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.robodynamics.dao.RDIncomeSourceDAO;
import com.robodynamics.model.RDIncomeSource;

@Repository
public class RDIncomeSourceDAOImpl implements RDIncomeSourceDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(RDIncomeSource incomeSource) {
        sessionFactory.getCurrentSession().save(incomeSource);
    }

    @Override
    public void update(RDIncomeSource incomeSource) {
        sessionFactory.getCurrentSession().update(incomeSource);
    }

    @Override
    public void delete(int id) {
        Session session = sessionFactory.getCurrentSession();
        RDIncomeSource source = session.byId(RDIncomeSource.class).load(id);
        if (source != null) session.delete(source);
    }

    @Override
    public RDIncomeSource getById(int id) {
        return sessionFactory.getCurrentSession().get(RDIncomeSource.class, id);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDIncomeSource> getAll() {
        return sessionFactory.getCurrentSession()
                .createQuery("FROM RDIncomeSource ORDER BY sourceName ASC")
                .list();
    }
}
