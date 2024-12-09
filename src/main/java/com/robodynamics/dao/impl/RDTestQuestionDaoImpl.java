package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDTestQuestionDao;
import com.robodynamics.model.RDTestQuestion;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDTestQuestionDaoImpl implements RDTestQuestionDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDTestQuestion testQuestion) {
        getSession().save(testQuestion);
    }

    @Override
    public RDTestQuestion findById(int id) {
        return getSession().get(RDTestQuestion.class, id);
    }

    @Override
    public List<RDTestQuestion> findByTestId(int testId) {
        return getSession()
                .createQuery("FROM RDTestQuestion WHERE testId = :testId", RDTestQuestion.class)
                .setParameter("testId", testId)
                .list();
    }

    @Override
    public List<RDTestQuestion> findAll() {
        return getSession().createQuery("FROM RDTestQuestion", RDTestQuestion.class).list();
    }

    @Override
    public void update(RDTestQuestion testQuestion) {
        getSession().update(testQuestion);
    }

    @Override
    public void deleteById(int id) {
        RDTestQuestion testQuestion = findById(id);
        if (testQuestion != null) {
            getSession().delete(testQuestion);
        }
    }
}
