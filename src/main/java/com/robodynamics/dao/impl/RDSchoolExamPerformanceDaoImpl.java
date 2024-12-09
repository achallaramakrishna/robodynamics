package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDSchoolExamPerformanceDao;
import com.robodynamics.model.RDSchoolExamPerformance;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDSchoolExamPerformanceDaoImpl implements RDSchoolExamPerformanceDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDSchoolExamPerformance performance) {
        getSession().save(performance);
    }

    @Override
    public RDSchoolExamPerformance findById(int id) {
        return getSession().get(RDSchoolExamPerformance.class, id);
    }

    @Override
    public List<RDSchoolExamPerformance> findByStudentId(int studentId) {
        return getSession()
                .createQuery("FROM RDSchoolExamPerformance WHERE studentId = :studentId", RDSchoolExamPerformance.class)
                .setParameter("studentId", studentId)
                .list();
    }

    @Override
    public List<RDSchoolExamPerformance> findByExamId(int examId) {
        return getSession()
                .createQuery("FROM RDSchoolExamPerformance WHERE examId = :examId", RDSchoolExamPerformance.class)
                .setParameter("examId", examId)
                .list();
    }

    @Override
    public List<RDSchoolExamPerformance> findAll() {
        return getSession().createQuery("FROM RDSchoolExamPerformance", RDSchoolExamPerformance.class).list();
    }

    @Override
    public void update(RDSchoolExamPerformance performance) {
        getSession().update(performance);
    }

    @Override
    public void deleteById(int id) {
        RDSchoolExamPerformance performance = findById(id);
        if (performance != null) {
            getSession().delete(performance);
        }
    }
}
