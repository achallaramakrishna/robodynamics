package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDSchoolExamSubjectDao;
import com.robodynamics.model.RDSchoolExamSubject;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDSchoolExamSubjectDaoImpl implements RDSchoolExamSubjectDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDSchoolExamSubject subject) {
        getSession().save(subject);
    }

    @Override
    public RDSchoolExamSubject findById(int id) {
        return getSession().get(RDSchoolExamSubject.class, id);
    }

    @Override
    public List<RDSchoolExamSubject> findByExamId(int examId) {
        return getSession()
                .createQuery("FROM RDSchoolExamSubject WHERE examId = :examId", RDSchoolExamSubject.class)
                .setParameter("examId", examId)
                .list();
    }

    @Override
    public List<RDSchoolExamSubject> findAll() {
        return getSession().createQuery("FROM RDSchoolExamSubject", RDSchoolExamSubject.class).list();
    }

    @Override
    public void update(RDSchoolExamSubject subject) {
        getSession().update(subject);
    }

    @Override
    public void deleteById(int id) {
        RDSchoolExamSubject subject = findById(id);
        if (subject != null) {
            getSession().delete(subject);
        }
    }
}
