package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDExamCutoffDao;
import com.robodynamics.model.RDExamCutoff;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDExamCutoffDaoImpl implements RDExamCutoffDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDExamCutoff cutoff) {
        getSession().save(cutoff);
    }

    @Override
    public RDExamCutoff findById(int id) {
        return getSession().get(RDExamCutoff.class, id);
    }

    @Override
    public List<RDExamCutoff> findByExamId(int examId) {
        return getSession()
                .createQuery("FROM RDExamCutoff WHERE examId = :examId", RDExamCutoff.class)
                .setParameter("examId", examId)
                .list();
    }

    @Override
    public List<RDExamCutoff> findAll() {
        return getSession().createQuery("FROM RDExamCutoff", RDExamCutoff.class).list();
    }

    @Override
    public void update(RDExamCutoff cutoff) {
        getSession().update(cutoff);
    }

    @Override
    public void deleteById(int id) {
        RDExamCutoff cutoff = findById(id);
        if (cutoff != null) {
            getSession().delete(cutoff);
        }
    }
}
