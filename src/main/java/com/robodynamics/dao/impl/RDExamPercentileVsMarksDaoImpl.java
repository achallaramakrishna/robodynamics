package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDExamPercentileVsMarksDao;
import com.robodynamics.model.RDExamPercentileVsMarks;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDExamPercentileVsMarksDaoImpl implements RDExamPercentileVsMarksDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDExamPercentileVsMarks percentileVsMarks) {
        getSession().save(percentileVsMarks);
    }

    @Override
    public RDExamPercentileVsMarks findById(int id) {
        return getSession().get(RDExamPercentileVsMarks.class, id);
    }

    @Override
    public List<RDExamPercentileVsMarks> findByExamId(int examId) {
        return getSession()
                .createQuery("FROM RDExamPercentileVsMarks WHERE examId = :examId", RDExamPercentileVsMarks.class)
                .setParameter("examId", examId)
                .list();
    }

    @Override
    public List<RDExamPercentileVsMarks> findAll() {
        return getSession().createQuery("FROM RDExamPercentileVsMarks", RDExamPercentileVsMarks.class).list();
    }

    @Override
    public void update(RDExamPercentileVsMarks percentileVsMarks) {
        getSession().update(percentileVsMarks);
    }

    @Override
    public void deleteById(int id) {
        RDExamPercentileVsMarks percentileVsMarks = findById(id);
        if (percentileVsMarks != null) {
            getSession().delete(percentileVsMarks);
        }
    }
}
