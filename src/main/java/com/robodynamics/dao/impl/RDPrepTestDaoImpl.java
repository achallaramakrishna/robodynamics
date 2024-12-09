package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDPrepTestDao;
import com.robodynamics.model.RDPrepTest;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDPrepTestDaoImpl implements RDPrepTestDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDPrepTest prepTest) {
        getSession().save(prepTest);
    }

    @Override
    public RDPrepTest findById(int id) {
        return getSession().get(RDPrepTest.class, id);
    }

    @Override
    public List<RDPrepTest> findByLearningPathId(int learningPathId) {
        return getSession()
                .createQuery("FROM RDPrepTest WHERE learningPathId = :learningPathId", RDPrepTest.class)
                .setParameter("learningPathId", learningPathId)
                .list();
    }

    @Override
    public List<RDPrepTest> findAll() {
        return getSession().createQuery("FROM RDPrepTest", RDPrepTest.class).list();
    }

    @Override
    public void update(RDPrepTest prepTest) {
        getSession().update(prepTest);
    }

    @Override
    public void deleteById(int id) {
        RDPrepTest prepTest = findById(id);
        if (prepTest != null) {
            getSession().delete(prepTest);
        }
    }
}
